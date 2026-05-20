<script setup>
import { onMounted } from 'vue';

onMounted(() => {
  // Detetar idioma do browser
  const browserLang = navigator.language || navigator.userLanguage;
  
  // Verificar se é inglês
  if (browserLang.startsWith('en')) {
    window.location.href = '/nodedump/en/';
  } else {
    // Fallback para português
    window.location.href = '/nodedump/';
  }
});
</script>

# Redirecionando...

Carregando...