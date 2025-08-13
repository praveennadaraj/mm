import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import {
  AllCommunityModule,
  ModuleRegistry,
  PaginationModule,
} from "ag-grid-community";
import {
  ColumnMenuModule,
  MenuModule,
  ClipboardModule,
  ExcelExportModule,
  CsvExportModule,
  RangeSelectionModule,
  ClientSideRowModelModule,
  MasterDetailModule,
  RowGroupingModule,
  ServerSideRowModelModule,
  ServerSideRowModelApiModule,
} from "ag-grid-enterprise";
ModuleRegistry.registerModules([
  AllCommunityModule,
  ColumnMenuModule,
  MenuModule,
  PaginationModule,
  ClipboardModule,
  ExcelExportModule,
  CsvExportModule,
  RangeSelectionModule,
  ClientSideRowModelModule,
  MasterDetailModule,
  RowGroupingModule,
  ServerSideRowModelModule,
  ServerSideRowModelApiModule,
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);
