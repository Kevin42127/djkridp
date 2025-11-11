const languageData = {
  de: {
    nav: {
      home: 'Startseite',
      about: 'Über mich',
      tours: 'Tours',
      works: 'Werke',
      contact: 'Kontakt'
    },
    hero: {
      title: 'DJKridP',
      subtitle: 'Multi-Genre DJ und ehemaliges Mitglied von Future Breeze aus Osnabrück (Deutschland)',
      description: 'Seit Ende der 90er Jahre spiele ich DJ-Sets in Deutschland, Kanada, Südafrika, Japan, Russland, Polen, Spanien, Italien und vielen weiteren Ländern.',
      button: 'Mehr erfahren'
    },
    about: {
      title: 'Über mich',
      description: 'Seit Ende der 90er Jahre spiele ich DJ-Sets in Deutschland, Kanada, Südafrika, Japan, Russland, Polen, Spanien, Italien und vielen weiteren Ländern.',
      futureBreeze: 'Ehemaliges Mitglied von Future Breeze',
      location: 'Osnabrück, Deutschland',
      since: 'Seit Ende der 90er Jahre aktiv',
      description2: 'Als Multi-Genre DJ bringe ich eine vielseitige Musikauswahl in meine Sets. Meine Erfahrung reicht von den Anfängen in den 90er Jahren bis heute, wo ich weiterhin auf internationalen Bühnen performe.',
      description3: 'Meine Karriere als DJ begann Ende der 90er Jahre und hat mich durch zahlreiche Länder geführt. Als ehemaliges Mitglied von Future Breeze habe ich Erfahrung in der elektronischen Musikszene gesammelt und setze diese bis heute fort.'
    },
    tours: {
      title: 'Tours',
      subtitle: 'Länder, in denen ich gespielt habe',
      countries: ['Deutschland', 'Kanada', 'Südafrika', 'Japan', 'Russland', 'Polen', 'Spanien', 'Italien'],
      experience: 'Internationale Erfahrung',
      experienceDesc: 'Seit Ende der 90er Jahre habe ich auf internationalen Bühnen gespielt und meine Musik in verschiedenen Ländern und Kulturen geteilt. Jede Tour war eine einzigartige Erfahrung und hat meine Musik und mein Verständnis für verschiedene Musikstile erweitert.'
    },
    works: {
      title: 'Werke',
      subtitle: 'Meine Musik',
      multiGenre: 'Multi-Genre Sets',
      multiGenreDesc: 'Als Multi-Genre DJ präsentiere ich verschiedene Musikstile in meinen Sets, von elektronischer Musik bis hin zu verschiedenen Genres, die die Vielfalt meiner musikalischen Erfahrung widerspiegeln.',
      futureBreeze: 'Future Breeze',
      futureBreezeDesc: 'Als ehemaliges Mitglied von Future Breeze war ich Teil eines Projekts, das die elektronische Musikszene geprägt hat. Diese Erfahrung hat meine musikalische Entwicklung maßgeblich beeinflusst.',
      live: 'Live Performances',
      liveDesc: 'Meine Live-Performances umfassen DJ-Sets auf internationalen Bühnen in zahlreichen Ländern. Jede Performance ist eine einzigartige Erfahrung, die das Publikum mit verschiedenen Musikstilen verbindet.'
    },
    contact: {
      title: 'Kontakt',
      subtitle: 'Verbinde dich mit mir',
      social: 'Soziale Medien',
      business: 'Geschäftliche Anfragen',
      businessDesc: 'Für geschäftliche Anfragen, Buchungen oder Kooperationen erreichen Sie mich über meine sozialen Medien Kanäle.'
    },
    footer: {
      copyright: '©',
      rights: 'Alle Rechte vorbehalten'
    }
  },
  en: {
    nav: {
      home: 'Home',
      about: 'About',
      tours: 'Tours',
      works: 'Works',
      contact: 'Contact'
    },
    hero: {
      title: 'DJKridP',
      subtitle: 'Multi-Genre DJ and ex member of Future Breeze from Osnabrück (Germany)',
      description: 'Since the end of the 90s, I have been playing DJ sets in Germany, Canada, South Africa, Japan, Russia, Poland, Spain, Italy and many more countries.',
      button: 'Learn More'
    },
    about: {
      title: 'About Me',
      description: 'Since the end of the 90s, I have been playing DJ sets in Germany, Canada, South Africa, Japan, Russia, Poland, Spain, Italy and many more countries.',
      futureBreeze: 'Ex member of Future Breeze',
      location: 'Osnabrück, Germany',
      since: 'Active since the end of the 90s',
      description2: 'As a Multi-Genre DJ, I bring a diverse selection of music to my sets. My experience ranges from the beginnings in the 90s to today, where I continue to perform on international stages.',
      description3: 'My career as a DJ began in the late 90s and has taken me through numerous countries. As an ex member of Future Breeze, I have gained experience in the electronic music scene and continue this to this day.'
    },
    tours: {
      title: 'Tours',
      subtitle: 'Countries where I have performed',
      countries: ['Germany', 'Canada', 'South Africa', 'Japan', 'Russia', 'Poland', 'Spain', 'Italy'],
      experience: 'International Experience',
      experienceDesc: 'Since the end of the 90s, I have played on international stages and shared my music in different countries and cultures. Each tour was a unique experience that has expanded my music and understanding of different musical styles.'
    },
    works: {
      title: 'Works',
      subtitle: 'My Music',
      multiGenre: 'Multi-Genre Sets',
      multiGenreDesc: 'As a Multi-Genre DJ, I present various music styles in my sets, from electronic music to different genres that reflect the diversity of my musical experience.',
      futureBreeze: 'Future Breeze',
      futureBreezeDesc: 'As an ex member of Future Breeze, I was part of a project that shaped the electronic music scene. This experience has significantly influenced my musical development.',
      live: 'Live Performances',
      liveDesc: 'My live performances include DJ sets on international stages in numerous countries. Each performance is a unique experience that connects the audience with different music styles.'
    },
    contact: {
      title: 'Contact',
      subtitle: 'Connect with me',
      social: 'Social Media',
      business: 'Business Inquiries',
      businessDesc: 'For business inquiries, bookings or collaborations, please contact me through my social media channels.'
    },
    footer: {
      copyright: '©',
      rights: 'All rights reserved'
    }
  }
};

let currentLanguage = localStorage.getItem('language') || 'de';

function setLanguage(lang) {
  currentLanguage = lang;
  localStorage.setItem('language', lang);
  updateLanguageSelect();
  updatePageContent();
}

function updateLanguageSelect() {
  const selectBtns = document.querySelectorAll('#language-select-btn, #language-select-btn-mobile');
  const options = document.querySelectorAll('.lang-option');
  
  const languageNames = {
    de: 'Deutsch',
    en: 'English'
  };
  
  selectBtns.forEach(selectBtn => {
    const selectText = selectBtn ? selectBtn.querySelector('.lang-select-text') : null;
    if (selectText) {
      selectText.textContent = languageNames[currentLanguage] || currentLanguage;
    }
  });
  
  options.forEach(option => {
    if (option.dataset.lang === currentLanguage) {
      option.classList.add('active');
    } else {
      option.classList.remove('active');
    }
  });
}

function updatePageContent() {
  try {
    const data = languageData[currentLanguage];
    if (!data) {
      console.warn(`Language data not found for: ${currentLanguage}`);
      return;
    }

    const elements = document.querySelectorAll('[data-language]');
    
    elements.forEach(element => {
      try {
        const keys = element.dataset.language.split('.');
        let value = data;
        
        for (const key of keys) {
          if (value && typeof value === 'object' && key in value) {
            value = value[key];
          } else {
            value = null;
            break;
          }
        }
        
        if (value !== null) {
          if (Array.isArray(value)) {
            const index = parseInt(element.dataset.index);
            if (!isNaN(index) && index >= 0 && index < value.length) {
              element.textContent = value[index];
            }
          } else if (element.tagName === 'INPUT' && element.type === 'text') {
            element.value = value;
          } else {
            element.textContent = value;
          }
        }
      } catch (error) {
        console.warn('Error updating element:', element, error);
      }
    });
    
    const countryItems = document.querySelectorAll('.country-item h3');
    if (countryItems.length > 0 && data.tours && data.tours.countries) {
      countryItems.forEach((item, index) => {
        if (index < data.tours.countries.length) {
          item.textContent = data.tours.countries[index];
        }
      });
    }
    
    document.documentElement.lang = currentLanguage;
  } catch (error) {
    console.error('Error in updatePageContent:', error);
  }
}

function initLanguageSelector(selectorId, dropdownId) {
  const languageSelector = document.querySelector(`#${selectorId}`).closest('.language-selector');
  const selectBtn = document.getElementById(selectorId);
  const dropdown = document.getElementById(dropdownId);
  const options = dropdown ? dropdown.querySelectorAll('.lang-option') : [];
  
  if (!selectBtn || !dropdown || !languageSelector) return;
  
  selectBtn.setAttribute('role', 'combobox');
  dropdown.setAttribute('role', 'listbox');

  selectBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    languageSelector.classList.toggle('open');
    const isOpen = languageSelector.classList.contains('open');
    selectBtn.setAttribute('aria-expanded', isOpen);
    if (isOpen && options.length > 0) {
      const activeOption = Array.from(options).find(opt => opt.classList.contains('active')) || options[0];
      activeOption.focus();
    }
  });

  selectBtn.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') {
      e.preventDefault();
      if (!languageSelector.classList.contains('open')) {
        languageSelector.classList.add('open');
        selectBtn.setAttribute('aria-expanded', 'true');
        if (options.length > 0) {
          const activeOption = Array.from(options).find(opt => opt.classList.contains('active')) || options[0];
          activeOption.focus();
        }
      }
    }
  });
  
  options.forEach((option, index) => {
    option.addEventListener('click', (e) => {
      e.stopPropagation();
      const lang = option.dataset.lang;
      setLanguage(lang);
      languageSelector.classList.remove('open');
      selectBtn.setAttribute('aria-expanded', 'false');
      selectBtn.focus();
    });

    option.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        option.click();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        const allOptions = Array.from(options);
        const nextOption = allOptions[index + 1] || allOptions[0];
        nextOption.focus();
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        const allOptions = Array.from(options);
        const prevOption = allOptions[index - 1] || allOptions[allOptions.length - 1];
        prevOption.focus();
      } else if (e.key === 'Escape') {
        languageSelector.classList.remove('open');
        selectBtn.setAttribute('aria-expanded', 'false');
        selectBtn.focus();
      }
    });

    option.setAttribute('tabindex', '-1');
    option.setAttribute('role', 'option');
  });
  
  document.addEventListener('click', (e) => {
    if (!languageSelector.contains(e.target)) {
      languageSelector.classList.remove('open');
      selectBtn.setAttribute('aria-expanded', 'false');
    }
  });
  
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && languageSelector.classList.contains('open')) {
      languageSelector.classList.remove('open');
      selectBtn.setAttribute('aria-expanded', 'false');
      selectBtn.focus();
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  updateLanguageSelect();
  updatePageContent();
  
  initLanguageSelector('language-select-btn', 'language-select-dropdown');
  initLanguageSelector('language-select-btn-mobile', 'language-select-dropdown-mobile');
});

