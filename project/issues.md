# Known Issues with Parquet Loading

Based on recent console logs and loader behavior, the following problems have been identified:

- **Unrecognized loader option ‘arrow.batchDebounceMs’**  
  The warning `loaders.gl: arrow loader option 'arrow.batchDebounceMs' not recognized` indicates that the custom loader configuration includes an obsolete or incorrect option. The current loaders.gl API expects only supported keys (e.g. `shape`) and ignores unknown options, so this needs to be removed or updated to match the version in use.

- **WASM initialization error in ParquetWasmLoader**  
  The runtime error `TypeError: Cannot read properties of undefined (reading 'parquetfile_fromFile')` in `ParquetFile.fromFile` suggests that the underlying `parquet-wasm` module was not loaded or instantiated correctly. This can happen when:
  - The versions of `@loaders.gl/parquet` and `parquet-wasm` (transitively pulled in by Kepler.gl) are out of sync.
  - Webpack rules for loading `.wasm` or import-meta are missing, preventing the WASM blob from being attached.
  - Aliasing or bundling the wrong copy of `apache-arrow` or `parquet-wasm` leads to unresolved exports.

---

## Additional Analysis & Suggestions

- **Version Conflict is the Core Issue**  
  There are both direct dependencies on loaders.gl packages (v3.4.x) and transitive dependencies through Kepler.gl (v4.x). This creates a diamond dependency problem where two different versions of the same WASM loader are present, causing unpredictable behavior.

- **Webpack WASM Configuration Needs Refinement**  
  The error suggests the WASM binary can't be found at runtime, indicating a path resolution or dynamic import issue. Ensure `.wasm` files are handled and that `@open-wc/webpack-import-meta-loader` is used for `parquet-wasm`.

- **Kepler.gl's Internal Loader System**  
  Kepler.gl registers and configures its own loaders. Attempting to override or re-register these in the app can cause conflicts, especially for file types like Parquet.

---

## Front-End/UX Impact

- **User Experience**: When Parquet loading fails, users see cryptic errors or broken data panels. This undermines trust and usability.
- **Error Presentation**: Current error messages are technical and not actionable for end users. There is no clear feedback or recovery path in the UI.
- **Maintainability**: Manual loader registration and version mismatches increase technical debt and make future upgrades riskier.

---

## Recommended Next Steps

1. **Remove manual loader registration** and let Kepler.gl handle all data loading with its bundled loaders.
2. **Fix webpack configuration** for WASM: ensure `experiments.asyncWebAssembly: true` is set, publicPath is correct, and import-meta loader is present for `parquet-wasm`.
3. **Synchronize package versions**: remove direct dependencies on loaders.gl packages, and ensure only one version is present (preferably the one Kepler.gl uses).
4. **Implement improved user-facing error handling**: Show clear, actionable messages in the UI when file loading fails, and provide guidance or fallback options.
5. **Rebuild and test**: After these changes, confirm that `ParquetWasmLoader` initializes and loads files without errors, and that the UI remains stable and informative.

---

## Current Status: Simplified Configuration Still Has WASM Issues (Latest Update)

After implementing the simplified approach based on Kepler.gl demo app analysis, the application successfully builds and runs, but still encounters the same two core issues:

1. **Arrow loader warning**: `loaders.gl: arrow loader option 'arrow.batchDebounceMs' not recognized`
2. **WASM initialization error**: `TypeError: Cannot read properties of undefined (reading 'parquetfile_fromFile')`

**Changes Completed:**
- ✅ Removed custom `src/loaders.js` file entirely
- ✅ Simplified webpack configuration to basic WASM handling
- ✅ Removed complex parquet-wasm specific rules and import-meta loader
- ✅ Cleaned up polyfills.js from custom WASM patches
- ✅ Removed unused `@open-wc/webpack-import-meta-loader` dependency
- ✅ Build succeeds with automatic WASM detection (5.24 MiB WASM file included)

**Current Analysis:**
The warnings and errors appear to be coming from Kepler.gl's internal loader system, not our custom configuration. This suggests the issues are deeper in the Kepler.gl v3.1.8 and loaders.gl version compatibility.

**Next Investigation Areas:**
1. Check if Kepler.gl v3.1.8 has known compatibility issues with newer browsers/WASM
2. Consider trying a different Kepler.gl version or investigating transitive dependency overrides
3. Investigate if the issue occurs with smaller/simpler Parquet files
4. Look into browser developer tools to see if WASM modules are loading correctly

---

## Verification

- Confirm that all direct loaders.gl dependencies are removed from `package.json`.
- Validate that webpack is correctly handling WASM and import-meta for `parquet-wasm`.
- Test with multiple Parquet files to ensure robust loading and user feedback.
- Review the UI for clear error messages and a smooth user experience.

---

*This document reflects the latest technical analysis and incorporates feedback on both the root causes and the front-end/user experience impact of the Parquet loading issues. All recommendations are actionable and should be verified as part of the resolution process.*