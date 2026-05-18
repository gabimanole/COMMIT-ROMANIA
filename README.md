# WordPress Template Processor

A powerful tool for processing WordPress templates (especially AVADA templates) by replacing guarded tags with actual content. Perfect for generating clean, copy-paste ready text files from template files.

## Features

- **Tag Replacement**: Replace custom tags with your content using JSON configuration
- **Multiple Tag Formats**: Support for various tag formats ({{tag}}, [tag], {tag}, %%tag%%)
- **Clean Output**: Generate clean text files ready for copy-paste
- **Configurable**: Easy-to-use JSON configuration system
- **Batch Processing**: Process multiple templates with different configurations

## Directory Structure

```
├── wordpress_template_processor.py  # Main processing script
├── config/                          # Configuration files
│   └── tag_mappings.json           # Tag mappings and settings
├── input/                           # Input template files
├── output/                          # Processed output files
├── examples/                        # Example templates and configurations
└── templates/                       # Template storage
```

## Getting Started

1. **Clone this repository:**
   ```bash
   git clone https://github.com/gabimanole/COMMIT-ROMANIA.git
   cd COMMIT-ROMANIA
   ```

2. **Install Python dependencies:**
   ```bash
   # No external dependencies required - uses only Python standard library
   ```

3. **Configure your tag mappings:**
   - Edit `config/tag_mappings.json` with your content
   - Add your custom tags and their replacement values

4. **Process your template:**
   ```bash
   python wordpress_template_processor.py
   ```

## Usage

### Basic Usage
```bash
# Process with default files
python wordpress_template_processor.py

# Process with custom files
python wordpress_template_processor.py config/my_config.json input/my_template.html output/result.txt

# List available tags
python wordpress_template_processor.py --list-tags

# Validate configuration
python wordpress_template_processor.py --validate
```

### Configuration

Edit `config/tag_mappings.json` to customize:
- **tag_mappings**: Your content replacements
- **tag_formats**: Supported tag formats
- **output_settings**: Content cleaning options
- **processing_options**: Advanced processing settings

### Example Tag Mappings

```json
{
  "tag_mappings": {
    "{{company_name}}": "Your Company Name",
    "{{company_email}}": "contact@yourcompany.com",
    "{{company_phone}}": "+1 (555) 123-4567"
  }
}
```

## Examples

Check the `examples/` directory for:
- Sample templates with various tag formats
- Different configuration examples
- Output samples

## License

This project is open source and available under the [MIT License](LICENSE).

---

**Ready to process your WordPress templates! 🚀**