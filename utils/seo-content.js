const LIMITS = Object.freeze({
  seoTitle: 200,
  metaDescription: 500,
  faqQuestion: 300,
  faqAnswer: 3000,
  shortAnswer: 5000,
  sectionTitle: 300,
  sectionContent: 12000,
  keyFact: 1000,
  activityTitle: 300,
  activityContent: 5000,
});

const RELATED_TYPES = new Set(['blog', 'pooncast']);
const FIRESTORE_ID_PATTERN = /^[A-Za-z0-9_-]{1,256}$/;

function cleanString(value, field, maxLength) {
  const cleaned = typeof value === 'string' ? value.trim() : '';

  if (cleaned.length > maxLength) {
    throw new Error(`${field} dépasse la taille maximale autorisée (${maxLength} caractères).`);
  }

  return cleaned;
}

export function createEmptySeoFields() {
  return {
    seoTitle: '',
    metaDescription: '',
    faq: [],
    relatedContent: [],
  };
}

export function createEmptyEpisodeSeoContent() {
  return {
    shortAnswer: '',
    sections: [],
    keyFacts: [],
    activity: { title: '', content: '' },
  };
}

export function normalizeFaq(value) {
  if (!Array.isArray(value)) return [];

  return value
    .map((item) => ({
      question: cleanString(item?.question, 'Question FAQ', LIMITS.faqQuestion),
      answer: cleanString(item?.answer, 'Réponse FAQ', LIMITS.faqAnswer),
    }))
    .filter((item) => item.question && item.answer)
    .slice(0, 50);
}

export function normalizeRelatedContent(value) {
  if (!Array.isArray(value)) return [];

  const seen = new Set();

  return value
    .map((item) => ({
      type: typeof item?.type === 'string' ? item.type.trim() : '',
      id: typeof item?.id === 'string' ? item.id.trim() : '',
    }))
    .filter((item) => {
      if (!RELATED_TYPES.has(item.type) || !FIRESTORE_ID_PATTERN.test(item.id)) return false;
      const key = `${item.type}:${item.id}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .slice(0, 20);
}

export function normalizeSeoFields(value = {}) {
  return {
    seoTitle: cleanString(value.seoTitle, 'SEO title', LIMITS.seoTitle),
    metaDescription: cleanString(value.metaDescription, 'Meta description', LIMITS.metaDescription),
    faq: normalizeFaq(value.faq),
    relatedContent: normalizeRelatedContent(value.relatedContent),
  };
}

export function normalizeEpisodeSeoContent(value = {}) {
  const activity = value?.activity || {};

  return {
    shortAnswer: cleanString(value.shortAnswer, 'Réponse courte', LIMITS.shortAnswer),
    sections: Array.isArray(value.sections)
      ? value.sections
          .map((section) => ({
            title: cleanString(section?.title, 'Titre de section', LIMITS.sectionTitle),
            content: cleanString(section?.content, 'Contenu de section', LIMITS.sectionContent),
          }))
          .filter((section) => section.title && section.content)
          .slice(0, 50)
      : [],
    keyFacts: Array.isArray(value.keyFacts)
      ? value.keyFacts
          .map((fact) => cleanString(fact, 'Fait à retenir', LIMITS.keyFact))
          .filter(Boolean)
          .slice(0, 50)
      : [],
    activity: {
      title: cleanString(activity.title, 'Titre de l’activité', LIMITS.activityTitle),
      content: cleanString(activity.content, 'Contenu de l’activité', LIMITS.activityContent),
    },
  };
}

export function normalizeArticleEditorData(value = {}) {
  return {
    title: cleanString(value.title, 'Titre historique', 500),
    intro: cleanString(value.intro, 'Introduction', 12000),
    chapters: Array.isArray(value.chapters) ? value.chapters : [],
    ...normalizeSeoFields(value),
  };
}

export function normalizeEpisodeEditorData(value = {}) {
  return {
    ...value,
    titre: cleanString(value.titre, 'Titre historique', 500),
    description: cleanString(value.description, 'Description', 12000),
    ...normalizeSeoFields(value),
    seoContent: normalizeEpisodeSeoContent(value.seoContent),
  };
}
