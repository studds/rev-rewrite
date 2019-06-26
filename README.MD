# rev-rewrite

Rename files with a revision hash, and then any rewrite references to the original file

## Installation

```bash
npm install --save-dev rev-rewrite
```

## Usage

### Single file to revision & rewrite

```bash

npx rev --rev-pattern source/example.json --rev-dest build --rewrite-pattern template.yaml --rewrite-dest build

```

This will copy source/example.json to build/example.{hash}.json and update any references in template.yaml to example.json to example.{hash}.json.

### Multiple files to revision & rewrite

You can pass in multiple patterns

```bash

npx rev --rev-pattern source/example.json --rev-pattern source/another.json --rev-dest build --rewrite-pattern template.yaml --rewrite-pattern other.yaml --rewrite-dest build

```

This will copy source/example.json and source/another.json to build, with the appropriate hashes, and update any references to example.json or another.json in template.yaml 
and other.yaml to include the rev hashes.

### Globs

You can use globs.

```bash

npx rev --rev-pattern source/*.json --rev-dest build --rewrite-pattern *.yaml --rewrite-dest build

```

This will copy all json files from source to build, with rev hashes added to the file name, and update any references to the json files in any yaml files.

## Limitations

This tool assumes that all rev'd filenames are unique, and doesn't try to understand relative paths. If you have source/a/example.json and source/b/example.json
in the file you're rewriting, then both will be overwritten with the first occurrence.
