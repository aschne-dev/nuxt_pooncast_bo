<template>
  <div>
    <div class="bg-tertiary grid grid-cols-3 items-center rounded-lg p-2 font-nunito gap-5">
      <div>{{ getFormattedDate(newsletter.timestamp) }}</div>
      <div>{{ newsletter.email }}</div>
      <div class="flex justify-end items-center">
        <svg  class="size-10" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"
          :class="{ 'fill-secondary': newsletter.optin }">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
          </svg>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  newsletter: Object,
});

function getFormattedDate(timestamp) {
  // Conversion du timestamp en millisecondes
  const milliseconds = timestamp.seconds * 1000 + Math.floor(timestamp.nanoseconds / 1000000);

  // Création d'un objet Date à partir des millisecondes
  const date = new Date(milliseconds);

  // Formatage de la date en jj/mm/aaaa hh:mm
  const formattedDate = date.toLocaleString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  return formattedDate;
}
</script>

<style>

</style>