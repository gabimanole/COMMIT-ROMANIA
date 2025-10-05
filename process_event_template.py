#!/usr/bin/env python3
"""
Event Template Processor
========================

Specialized processor for AVADA event templates that handles event titles
in the format "#[number] [title]" and replaces them with proper content.

Usage:
    python process_event_template.py [event_title] [config_file] [input_file] [output_file]

Example:
    python process_event_template.py "#42 Eveniment ( TEMPLATE )" config/tag_mappings.json templates/avada_event_template.html output/processed_event.txt
"""

import os
import sys
import re
import json
import argparse
from pathlib import Path
from typing import Dict, Any, Optional, Tuple


class EventTemplateProcessor:
    """Specialized processor for event templates with title validation."""
    
    def __init__(self, config_file: str = "config/tag_mappings.json"):
        """Initialize the processor with configuration."""
        self.config_file = config_file
        self.config = self.load_config()
        self.tag_patterns = self.build_tag_patterns()
    
    def load_config(self) -> Dict[str, Any]:
        """Load configuration from JSON file."""
        try:
            with open(self.config_file, 'r', encoding='utf-8') as f:
                return json.load(f)
        except FileNotFoundError:
            print(f"Warning: Config file '{self.config_file}' not found. Using defaults.")
            return self.get_default_config()
        except json.JSONDecodeError as e:
            print(f"Error: Invalid JSON in config file: {e}")
            return self.get_default_config()
    
    def get_default_config(self) -> Dict[str, Any]:
        """Return default configuration."""
        return {
            "tag_mappings": {
                "{{event_title}}": "#42 Eveniment ( TEMPLATE )",
                "{{event_number}}": "42",
                "{{event_name}}": "Eveniment",
                "{{event_type}}": "Event"
            },
            "tag_formats": [
                "{{tag_name}}",
                "{{ tag_name }}",
                "[tag_name]",
                "{tag_name}",
                "%%tag_name%%"
            ],
            "output_settings": {
                "remove_html_comments": True,
                "clean_whitespace": True,
                "preserve_line_breaks": True
            }
        }
    
    def build_tag_patterns(self) -> Dict[str, str]:
        """Build regex patterns for different tag formats."""
        patterns = {}
        tag_mappings = self.config.get("tag_mappings", {})
        
        for tag_format in self.config.get("tag_formats", []):
            # Convert format template to regex pattern
            if "{{" in tag_format and "}}" in tag_format:
                pattern = tag_format.replace("{{", r"\{\{").replace("}}", r"\}\}")
            elif "[" in tag_format and "]" in tag_format:
                pattern = tag_format.replace("[", r"\[").replace("]", r"\]")
            elif "{" in tag_format and "}" in tag_format:
                pattern = tag_format.replace("{", r"\{").replace("}", r"\}")
            elif "%%" in tag_format:
                pattern = tag_format.replace("%%", r"%%")
            else:
                continue
            
            # Replace tag_name with capture group
            pattern = pattern.replace("tag_name", r"([a-zA-Z_][a-zA-Z0-9_]*)")
            patterns[tag_format] = pattern
        
        return patterns
    
    def validate_event_title(self, event_title: str) -> Tuple[bool, str, str]:
        """
        Validate event title format: #[number] [title]
        Returns: (is_valid, number, title)
        """
        # Pattern: # followed by digits, then space, then title
        pattern = r'^#(\d+)\s+(.+)$'
        match = re.match(pattern, event_title.strip())
        
        if match:
            number = match.group(1)
            title = match.group(2)
            return True, number, title
        else:
            return False, "", ""
    
    def process_event_template(self, event_title: str, input_file: str, output_file: str) -> bool:
        """Process the event template with title validation."""
        # Validate event title format
        is_valid, number, title = self.validate_event_title(event_title)
        
        if not is_valid:
            print(f"❌ Error: Invalid event title format: '{event_title}'")
            print("Expected format: #[number] [title] (e.g., '#42 Eveniment ( TEMPLATE )')")
            return False
        
        print(f"✅ Event title validated:")
        print(f"   Number: {number}")
        print(f"   Title: {title}")
        
        try:
            # Read input file
            with open(input_file, 'r', encoding='utf-8') as f:
                content = f.read()
            
            # Update configuration with the validated event data
            self.config["tag_mappings"]["{{event_title}}"] = event_title
            self.config["tag_mappings"]["{{event_number}}"] = number
            self.config["tag_mappings"]["{{event_name}}"] = title
            
            # Process content
            processed_content = self.replace_tags(content)
            processed_content = self.clean_content(processed_content)
            
            # Write output file
            with open(output_file, 'w', encoding='utf-8') as f:
                f.write(processed_content)
            
            print(f"✅ Event template processed successfully!")
            print(f"📁 Input: {input_file}")
            print(f"📁 Output: {output_file}")
            print(f"📋 Event: {event_title}")
            return True
            
        except FileNotFoundError:
            print(f"❌ Error: Input file '{input_file}' not found.")
            return False
        except Exception as e:
            print(f"❌ Error processing template: {e}")
            return False
    
    def replace_tags(self, content: str) -> str:
        """Replace all tags in the content with their mapped values."""
        tag_mappings = self.config.get("tag_mappings", {})
        
        for tag_format, pattern in self.tag_patterns.items():
            def replace_match(match):
                tag_name = match.group(1)
                # Try different variations of the tag name
                possible_keys = [
                    tag_name,
                    tag_name.lower(),
                    tag_name.upper(),
                    tag_name.replace("_", "-"),
                    tag_name.replace("-", "_")
                ]
                
                for key in possible_keys:
                    if key in tag_mappings:
                        return tag_mappings[key]
                
                # If no mapping found, return original tag
                return match.group(0)
            
            content = re.sub(pattern, replace_match, content)
        
        return content
    
    def clean_content(self, content: str) -> str:
        """Clean the content according to output settings."""
        settings = self.config.get("output_settings", {})
        
        if settings.get("remove_html_comments", True):
            # Remove HTML comments
            content = re.sub(r'<!--.*?-->', '', content, flags=re.DOTALL)
        
        if settings.get("clean_whitespace", True):
            # Clean excessive whitespace
            content = re.sub(r'\n\s*\n\s*\n', '\n\n', content)  # Multiple empty lines to double
            content = re.sub(r'[ \t]+', ' ', content)  # Multiple spaces to single
        
        if not settings.get("preserve_line_breaks", True):
            # Remove line breaks
            content = content.replace('\n', ' ').replace('\r', ' ')
        
        return content.strip()
    
    def list_available_tags(self) -> None:
        """List all available tags and their mappings."""
        tag_mappings = self.config.get("tag_mappings", {})
        
        if not tag_mappings:
            print("No tag mappings found in configuration.")
            return
        
        print("Available Event Tags and Mappings:")
        print("=" * 50)
        for tag, value in tag_mappings.items():
            print(f"{tag:<25} -> {value}")
    
    def validate_config(self) -> bool:
        """Validate the configuration file."""
        required_keys = ["tag_mappings", "tag_formats", "output_settings"]
        
        for key in required_keys:
            if key not in self.config:
                print(f"❌ Missing required config key: {key}")
                return False
        
        if not self.config.get("tag_mappings"):
            print("❌ No tag mappings found in configuration.")
            return False
        
        print("✅ Configuration is valid.")
        return True


def main():
    """Main entry point for the script."""
    parser = argparse.ArgumentParser(
        description="Process AVADA event templates with title validation",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  python process_event_template.py "#42 Eveniment ( TEMPLATE )"
  python process_event_template.py "#42 Eveniment ( TEMPLATE )" config/tag_mappings.json templates/avada_event_template.html output/processed_event.txt
  python process_event_template.py --list-tags
  python process_event_template.py --validate

Event Title Format:
  Must start with # followed by a number, then space, then title
  Example: "#42 Eveniment ( TEMPLATE )"
        """
    )
    
    parser.add_argument("event_title", nargs="?", 
                       help="Event title in format '#[number] [title]' (e.g., '#42 Eveniment ( TEMPLATE )')")
    parser.add_argument("config_file", nargs="?", default="config/tag_mappings.json",
                       help="Configuration file path (default: config/tag_mappings.json)")
    parser.add_argument("input_file", nargs="?", default="templates/avada_event_template.html",
                       help="Input template file (default: templates/avada_event_template.html)")
    parser.add_argument("output_file", nargs="?", default="output/processed_event.txt",
                       help="Output file (default: output/processed_event.txt)")
    parser.add_argument("--list-tags", action="store_true",
                       help="List available tags and exit")
    parser.add_argument("--validate", action="store_true",
                       help="Validate configuration and exit")
    
    args = parser.parse_args()
    
    # Initialize processor
    processor = EventTemplateProcessor(args.config_file)
    
    # Handle special commands
    if args.list_tags:
        processor.list_available_tags()
        return
    
    if args.validate:
        processor.validate_config()
        return
    
    # Check if event title is provided
    if not args.event_title:
        print("❌ Error: Event title is required.")
        print("Usage: python process_event_template.py '#[number] [title]'")
        print("Example: python process_event_template.py '#42 Eveniment ( TEMPLATE )'")
        sys.exit(1)
    
    # Process template
    success = processor.process_event_template(args.event_title, args.input_file, args.output_file)
    
    if success:
        print("\n🎉 Event template processing completed successfully!")
        print(f"📋 You can now copy the content from: {args.output_file}")
    else:
        print("\n❌ Event template processing failed!")
        sys.exit(1)


if __name__ == "__main__":
    main()

