const fs = require('fs-extra');
const path = require('path');

class TemplateProcessor {
  constructor() {
    this.configPath = path.join(__dirname, '..', 'config', 'default.json');
  }

  async loadConfig() {
    try {
      return await fs.readJson(this.configPath);
    } catch (error) {
      console.error('Error loading config:', error);
      return this.getDefaultConfig();
    }
  }

  getDefaultConfig() {
    return {
      chapter: "Iasi",
      event: {
        title: "#42 Eveniment ( TEMPLATE )",
        number: "42",
        name: "Eveniment",
        type: "Event",
        date: "December 22, 2024",
        time: "18:00",
        location: {
          name: "ENTRIC",
          address: "Str. Palat 3, UBS 3, et. 4, Iasi, Iasi, Romania"
        },
        registration: {
          href: "https://lu.ma/event/evt-MlnRl7gSD3a6Do2",
          class: "luma-checkout--button",
          dataAction: "checkout",
          dataEventId: "evt-MlnRl7gSD3a6Do2",
          text: "Register for Event",
          scriptSrc: "https://embed.lu.ma/checkout-button.js"
        }
      },
      speaker: {
        name: "J. Doe",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse finibus interdum nibh, pharetra maximus sapien. Cras quam mi, cursus sed augue aliquam, pellentesque mattis orci. Donec tristique eros urna, ac lacinia est feugiat vel. Proin turpis nibh, convallis auctor vehicula quis, sollicitudin vitae lorem. Suspendisse sed nibh mattis, faucibus tellus.",
        image: "https://nouveaux.ro/wp-content/uploads/2024/03/Adrian-Rindasu-300x300.jpeg"
      },
      agenda: [
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit.\n\nSuspendisse finibus interdum nibh, pharetra maximus sapien. Cras quam mi, cursus sed augue aliquam, pellentesque mattis orci. Donec tristique eros urna, ac lacinia est feugiat vel. Proin turpis nibh, convallis auctor vehicula quis, sollicitudin vitae lorem. Suspendisse sed nibh mattis, faucibus tellus.",
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit.\n\nSuspendisse finibus interdum nibh, pharetra maximus sapien. Cras quam mi, cursus sed augue aliquam, pellentesque mattis orci. Donec tristique eros urna, ac lacinia est feugiat vel. Proin turpis nibh, convallis auctor vehicula quis, sollicitudin vitae lorem. Suspendisse sed nibh mattis, faucibus tellus.",
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit.\n\nSuspendisse finibus interdum nibh, pharetra maximus sapien. Cras quam mi, cursus sed augue aliquam, pellentesque mattis orci. Donec tristique eros urna, ac lacinia est feugiat vel. Proin turpis nibh, convallis auctor vehicula quis, sollicitudin vitae lorem. Suspendisse sed nibh mattis, faucibus tellus."
      ],
      summary: "Suspendisse finibus interdum nibh, pharetra maximus sapien. Cras quam mi, cursus sed augue aliquam, pellentesque mattis orci. Donec tristique eros urna, ac lacinia est feugiat vel. Proin turpis nibh, convallis auctor vehicula quis, sollicitudin vitae lorem. Suspendisse sed nibh mattis, faucibus tellus."
    };
  }

  async processTemplate(eventData, templateType = 'default') {
    const config = await this.loadConfig();
    
    // Merge event data with config
    const mergedConfig = this.mergeConfig(config, eventData);
    
    // Load template
    const templatePath = path.join(__dirname, '..', 'templates', 'avada_event_template.html');
    let template = await fs.readFile(templatePath, 'utf8');
    
    // Process all replacements
    template = this.processReplacements(template, mergedConfig);
    
    // Generate output filename
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const outputFilename = `event_${timestamp}.html`;
    const outputPath = path.join(__dirname, '..', 'output', outputFilename);
    
    // Save processed template
    await fs.writeFile(outputPath, template, 'utf8');
    
    return {
      filename: outputFilename,
      content: template,
      config: mergedConfig
    };
  }

  mergeConfig(config, eventData) {
    const merged = { ...config };
    
    // Merge event data
    if (eventData.event) {
      merged.event = { ...merged.event, ...eventData.event };
    }
    
    if (eventData.chapter) {
      merged.chapter = eventData.chapter;
    }
    
    if (eventData.speaker) {
      merged.speaker = { ...merged.speaker, ...eventData.speaker };
    }
    
    if (eventData.agenda) {
      merged.agenda = eventData.agenda;
    }
    
    if (eventData.summary) {
      merged.summary = eventData.summary;
    }
    
    if (eventData.registration) {
      merged.event.registration = { ...merged.event.registration, ...eventData.registration };
    }
    
    return merged;
  }

  processReplacements(template, config) {
    let processed = template;
    
    // 1. Replace chapter (e.g., .Cluj-Napoca [chapter])
    const chapterPattern = /\.\w+-\w+\s*\[chapter\]/g;
    processed = processed.replace(chapterPattern, `.${config.chapter} [chapter]`);
    
    // 2. Replace event title
    processed = processed.replace(/\{\{event_title\}\}/g, config.event.title);
    
    // 3. Replace date and time
    const dateTimePattern = /\[start par date\]([\s\S]*?)\[end par date\]/g;
    processed = processed.replace(dateTimePattern, `${config.event.date}\n${config.event.time}`);
    
    // 4. Replace location
    const locationPattern = /\[start location\]([\s\S]*?)\[end location\]/g;
    const locationText = `${config.event.location.name}\n${config.event.location.address}`;
    processed = processed.replace(locationPattern, locationText);
    
    // 5. Replace registration code block
    const registrationPattern = /<a[\s\S]*?data-luma-event-id="[^"]*"[\s\S]*?<\/a>\s*<script[\s\S]*?<\/script>/g;
    const registrationCode = this.generateRegistrationCode(config.event.registration);
    processed = processed.replace(registrationPattern, registrationCode);
    
    // 6. Replace speaker information
    const speakerNamePattern = /\[start speaker name\][\s\S]*?\[end speaker name\]/g;
    processed = processed.replace(speakerNamePattern, config.speaker.name);
    
    const speakerDescPattern = /\[start speaker description\]([\s\S]*?)\[end speaker description\]/g;
    processed = processed.replace(speakerDescPattern, config.speaker.description);
    
    // 7. Replace agenda items
    processed = this.replaceAgendaItems(processed, config.agenda);
    
    // 8. Replace event summary
    const summaryPattern = /Suspendisse finibus interdum nibh, pharetra maximus sapien\. Cras quam mi, cursus sed augue aliquam, pellentesque mattis orci\. Donec tristique eros urna, ac lacinia est feugiat vel\. Proin turpis nibh, convallis auctor vehicula quis, sollicitudin vitae lorem\. Suspendisse sed nibh mattis, faucibus tellus\./g;
    processed = processed.replace(summaryPattern, config.summary);
    
    return processed;
  }

  generateRegistrationCode(registration) {
    return `<a
  href="${registration.href}"
  class="${registration.class}"
  data-luma-action="${registration.dataAction}"
  data-luma-event-id="${registration.dataEventId}"
>
  ${registration.text}
</a>

<script id="luma-checkout" src="${registration.scriptSrc}"></script>`;
  }

  replaceAgendaItems(template, agendaItems) {
    // Find all agenda item blocks and replace them
    const agendaPattern = /\[fusion_li_item\]([\s\S]*?)\[\/fusion_li_item\]/g;
    const matches = [...template.matchAll(agendaPattern)];
    
    if (matches.length === 0) return template;
    
    let processed = template;
    
    // Replace each agenda item
    matches.forEach((match, index) => {
      if (index < agendaItems.length) {
        const replacement = `[fusion_li_item]

${agendaItems[index]}

[/fusion_li_item]`;
        processed = processed.replace(match[0], replacement);
      }
    });
    
    return processed;
  }

  async saveConfig(config) {
    await fs.writeJson(this.configPath, config, { spaces: 2 });
  }

  async getTemplates() {
    const templatesDir = path.join(__dirname, '..', 'templates');
    const files = await fs.readdir(templatesDir);
    return files.filter(file => file.endsWith('.html'));
  }
}

module.exports = TemplateProcessor;
