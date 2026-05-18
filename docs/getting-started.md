# Getting Started with WordPress Template Processor

Welcome to the WordPress Template Processor! This guide will help you get started with processing WordPress templates and replacing tags with your content.

## Prerequisites

- Python 3.6 or higher
- Basic understanding of HTML/WordPress templates
- Text editor or IDE of your choice

## Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/gabimanole/COMMIT-ROMANIA.git
   cd COMMIT-ROMANIA
   ```

2. **Verify Python installation:**
   ```bash
   python --version
   # or
   python3 --version
   ```

## Directory Overview

- **`wordpress_template_processor.py`** - Main processing script
- **`config/`** - Configuration files (tag mappings, settings)
- **`input/`** - Your template files to process
- **`output/`** - Generated clean text files
- **`examples/`** - Sample templates and configurations
- **`templates/`** - Template storage
- **`docs/`** - Documentation (you are here!)

## Quick Start

### 1. Configure Your Tags

Edit `config/tag_mappings.json` to define your content:

```json
{
  "tag_mappings": {
    "{{company_name}}": "Your Company Name",
    "{{company_email}}": "contact@yourcompany.com",
    "{{company_phone}}": "+1 (555) 123-4567"
  }
}
```

### 2. Prepare Your Template

Place your WordPress template in `input/template.html` with tags like:
```html
<h1>{{company_name}}</h1>
<p>Contact us at {{company_email}} or {{company_phone}}</p>
```

### 3. Process the Template

```bash
python wordpress_template_processor.py
```

### 4. Get Your Clean Text

Check `output/processed.txt` for your copy-paste ready content!

## Common Tasks

### Processing Different Templates

```bash
# Use custom files
python wordpress_template_processor.py config/my_config.json input/my_template.html output/my_result.txt
```

### Listing Available Tags

```bash
python wordpress_template_processor.py --list-tags
```

### Validating Configuration

```bash
python wordpress_template_processor.py --validate
```

### Batch Processing

Create multiple configuration files for different clients:
- `config/client1.json`
- `config/client2.json`
- `config/client3.json`

Then process each:
```bash
python wordpress_template_processor.py config/client1.json input/template.html output/client1.txt
python wordpress_template_processor.py config/client2.json input/template.html output/client2.txt
```

## Supported Tag Formats

The processor supports multiple tag formats:
- `{{tag_name}}` - Double curly braces
- `{{ tag_name }}` - Double curly braces with spaces
- `[tag_name]` - Square brackets
- `{tag_name}` - Single curly braces
- `%%tag_name%%` - Double percent signs

## Getting Help

- Check the examples in the `examples/` directory
- Look at the sample configuration in `config/tag_mappings.json`
- Read the main script comments for advanced usage
- Open an issue on GitHub for questions

Happy template processing! 🚀