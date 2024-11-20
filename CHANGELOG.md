# Changelog

## [0.1.0] - 2024-11-20

### Added
- **Attributes parsing**: Attributes are now included in the returned object under the `$attrs` key.
- **Text content handling**: Text content is now stored in an object under the `#text` key, rather than as a raw string.

### Changed
- The structure of the returned JSON now includes attributes and text content in a more structured format, allowing for better handling of XML data.
