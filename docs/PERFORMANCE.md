# Performance Guidelines & Baseline Metrics

## Core Strategies Implemented

1. **Lazy Loading via React.lazy()**
   - Non-critical pages like `PatientsPage`, `ReportsPage`, `SettingsPage`, and `PatientDetailPage` are loaded dynamically, speeding up initial dashboard loading.

2. **Rollup Manual Chunks**
   - Heavy dependencies are bundled independently:
     - `vendor-firebase` for Firebase SDK logic
     - `vendor-charts` for Recharts

3. **Asset Optimization**
   - Removed presentation generator `pptxgenjs` from the production bundle as it is not actively used in the browser flow.

4. **Lint and Strict Typing**
   - Enforcing strict typings ensures the build tool can accurately tree-shake unused code and avoid dead paths.

## Future Recommendations
- If patient logs become heavily populated, pagination and virtualization should be added to `PatientsPage` tables.
- Incorporate a React Suspense boundary around the charts to prevent rendering freezes when rendering large SVG datasets.
