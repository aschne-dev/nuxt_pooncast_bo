import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import {
  normalizeArticleEditorData,
  normalizeEpisodeEditorData,
  normalizeFaq,
  normalizeRelatedContent,
} from '../utils/seo-content.js';

test('le schéma article reste additif et nettoie les champs SEO', () => {
  const article = normalizeArticleEditorData({
    title: ' Titre historique ',
    intro: ' Introduction ',
    chapters: [{ name: 'H2', text: '<p>Texte</p>' }],
    seoTitle: ' Titre SEO ',
    metaDescription: ' Meta ',
  });

  assert.equal(article.title, 'Titre historique');
  assert.equal(article.seoTitle, 'Titre SEO');
  assert.equal(article.metaDescription, 'Meta');
  assert.deepEqual(article.chapters, [{ name: 'H2', text: '<p>Texte</p>' }]);
});

test('le schéma épisode accepte les anciens documents sans contenu SEO', () => {
  const episode = normalizeEpisodeEditorData({
    titre: 'Épisode historique',
    description: 'Résumé existant',
    audio: { fluxRss: 'https://example.com/audio.mp3' },
  });

  assert.equal(episode.seoTitle, '');
  assert.equal(episode.metaDescription, '');
  assert.deepEqual(episode.faq, []);
  assert.deepEqual(episode.relatedContent, []);
  assert.deepEqual(episode.seoContent, {
    shortAnswer: '',
    sections: [],
    keyFacts: [],
    activity: { title: '', content: '' },
  });
});

test('FAQ et relations incomplètes, dupliquées ou invalides sont éliminées', () => {
  assert.deepEqual(normalizeFaq([
    { question: ' Question ', answer: ' Réponse ' },
    { question: 'Sans réponse', answer: '' },
  ]), [{ question: 'Question', answer: 'Réponse' }]);

  assert.deepEqual(normalizeRelatedContent([
    { type: 'blog', id: 'article-1' },
    { type: 'blog', id: 'article-1' },
    { type: 'external', id: 'bad' },
    { type: 'pooncast', id: 'episode_1' },
    { type: 'pooncast', id: '../bad' },
  ]), [
    { type: 'blog', id: 'article-1' },
    { type: 'pooncast', id: 'episode_1' },
  ]);
});

test('les sauvegardes BO écrivent updatedAt mais protègent les titres historiques', async () => {
  const [articleForm, episodeForm, articleStore, episodeStore] = await Promise.all([
    readFile(new URL('../components/Blog/AddBlog.vue', import.meta.url), 'utf8'),
    readFile(new URL('../components/PoonCast/Pooncast.vue', import.meta.url), 'utf8'),
    readFile(new URL('../stores/Blog/blog.js', import.meta.url), 'utf8'),
    readFile(new URL('../stores/Pooncast/Pooncast.js', import.meta.url), 'utf8'),
  ]);

  assert.match(articleForm, /:disabled="Boolean\(props\.blog\)"/);
  assert.match(episodeForm, /v-model="titre"[^>]*disabled/);
  assert.match(articleStore, /updatedAt: serverTimestamp\(\)/);
  assert.match(episodeStore, /updatedAt: serverTimestamp\(\)/);
});
