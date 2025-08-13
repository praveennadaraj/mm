import React, { useMemo, useState } from "react";
import { AgGridReact } from "ag-grid-react";
import { Button, Modal } from "antd";
import { TextField } from "@mui/material";

const initialState = {
  tableData: [
    { name: "Praveen", dept: "ECE", regNo: 81, age: 20 },
    { name: "Vignesh", dept: "ECE", regNo: 127, age: 21 },
  ],
  addModal: {
    show: false,
    editIndex: null,
    data: {
      name: "",
      dept: "",
      regNo: "",
      age: "",
    },
  },
};

const Table = () => {
  const [tableData, setTableData] = useState(initialState.tableData);
  const [addModal, setAddModal] = useState(initialState.addModal);

  const handleDelete = (regNo) => {
    setTableData((prev) => prev.filter((item) => item.regNo !== regNo));
  };

  const handleEdit = (rowData) => {
    const index = tableData.findIndex((item) => item.regNo === rowData.regNo);
    setAddModal({
      show: true,
      editIndex: index,
      data: { ...rowData },
    });
  };

  const handleOpenModal = () => {
    setAddModal({ ...initialState.addModal, show: true });
  };

  const handleCloseModal = () => {
    setAddModal(initialState.addModal);
  };

  const handleSave = () => {
    const { name = "", age = "", dept = "", regNo = "" } = addModal.data || {};
    if (!name || !age || !dept || !regNo) {
      alert("All fields are required");
      return;
    }

    if (addModal.editIndex !== null) {
      const updated = [...tableData];
      updated[addModal.editIndex] = addModal.data;
      setTableData(updated);
    } else {
      setTableData((prev) => [...prev, addModal.data]);
    }

    handleCloseModal();
  };

  const columnDefs = useMemo(
    () => [
      { headerName: "Name", field: "name", minWidth: 200, flex: 1 },
      { headerName: "Age", field: "age", width: 100 },
      { headerName: "Dept", field: "dept", width: 100 },
      {
        headerName: "RegNo",
        field: "regNo",
        width: 100,
        valueGetter: (params) => Number(params?.data?.regNo || ""),
      },
      {
        headerName: "Actions",
        width: 250,
        cellRenderer: (params) => (
          <div className="flex gap-2">
            <Button danger onClick={() => handleDelete(params.data.regNo)}>
              Delete
            </Button>
            <Button type="primary" onClick={() => handleEdit(params.data)}>
              Edit
            </Button>
          </div>
        ),
      },
    ],
    []
  );

  return (
    <div className="w-full h-full flex flex-col gap-4">
      <h1 className="text-center text-2xl font-bold text-gray-800">
        Student Details
      </h1>
      <div className="w-full flex justify-end">
        <Button onClick={handleOpenModal}>Add</Button>
      </div>
      <div className="w-full h-3/5 ">
        <AgGridReact rowData={tableData} columnDefs={columnDefs} />
      </div>

      <Modal
        title={addModal.editIndex !== null ? "Edit Student" : "Add Student"}
        open={addModal?.show || false}
        onOk={handleSave}
        onCancel={handleCloseModal}
      >
        <TextField
          size="small"
          variant="outlined"
          label="Name"
          fullWidth
          required
          style={{ marginTop: "10px" }}
          value={addModal?.data?.name || ""}
          onChange={(e) => {
            const value = e?.target?.value || "";
            if (value.length > 200) return;
            setAddModal((prev) => ({
              ...prev,
              data: { ...prev.data, name: value },
            }));
          }}
        />
        <TextField
          type="number"
          size="small"
          variant="outlined"
          label="Age"
          fullWidth
          required
          style={{ marginTop: "10px" }}
          value={addModal?.data?.age || ""}
          onChange={(e) => {
            const value = Number(e?.target?.value) || "";
            if (value < 0) alert("Age cannot less than 0 ...");
            setAddModal((prev) => ({
              ...prev,
              data: { ...prev.data, age: value },
            }));
          }}
        />
        <TextField
          size="small"
          variant="outlined"
          label="Department"
          fullWidth
          required
          style={{ marginTop: "10px" }}
          value={addModal?.data?.dept || ""}
          onChange={(e) => {
            const value = e?.target?.value || "";
            setAddModal((prev) => ({
              ...prev,
              data: { ...prev.data, dept: value },
            }));
          }}
        />
        <TextField
          size="small"
          variant="outlined"
          label="Reg No"
          fullWidth
          required
          style={{ marginTop: "10px" }}
          type="number"
          value={addModal?.data?.regNo || ""}
          onChange={(e) => {
            const value = Number(e?.target?.value) || "";
            setAddModal((prev) => ({
              ...prev,
              data: { ...prev.data, regNo: value },
            }));
          }}
        />
      </Modal>
    </div>
  );
};

export default Table;

// import React, {
//   useState,
//   useEffect,
//   useMemo,
//   useRef,
//   useCallback,
// } from "react";
// import axios from "./axios";
// import { AgGridReact } from "ag-grid-react";
// import "ag-grid-enterprise";
// import { Button, Modal } from "antd";
// import { TextField } from "@mui/material";
// import { themeQuartz } from "ag-grid-community";

// const initialState = {
//   addModal: {
//     show: false,
//     editId: null,
//     data: {
//       name: "",
//       dept: "",
//       regNo: "",
//       age: "",
//       dob: "",
//       phone: "",
//       state: "",
//       district: "",
//       courses: [],
//     },
//   },
// };

// const Student = () => {
//   const [student, setStudent] = useState([]);
//   const [addModal, setAddModal] = useState(initialState.addModal);

//   const tableData = student;
//   const gridRef = useRef();

//   const myTheme = themeQuartz.withParams({
//     backgroundColor: "#1f2836",
//     browserColorScheme: "dark",
//     chromeBackgroundColor: {
//       ref: "foregroundColor",
//       mix: 0.07,
//       onto: "backgroundColor",
//     },
//     foregroundColor: "#FFF",
//     headerFontSize: 14,
//   });

//   const fetchStudents = async () => {
//     try {
//       if (gridRef?.current?.showLoadingOverlay)
//         gridRef.current.showLoadingOverlay();

//       const res = await axios.get("/get");
//       const students = res?.data || [];

//       if (gridRef?.current?.hideOverlay) gridRef.current.hideOverlay();

//       if (students.length) {
//         setStudent(students);
//       } else {
//         setStudent([]);
//         if (gridRef?.current?.showNoRowsOverlay)
//           gridRef.current.showNoRowsOverlay();
//       }
//     } catch (err) {
//       console.error("Error fetching students:", err);
//       if (gridRef?.current?.showNoRowsOverlay)
//         gridRef.current.showNoRowsOverlay();
//     }
//   };

//   const handleCellValueChange = async (params) => {
//     console.log(params);

//     const { colDef, newValue, oldValue, data, node } = params;
//     const field = colDef.field;

//     if (field === "name") {
//       if (!newValue || newValue.trim() === "" || newValue.length > 200) {
//         alert("Enter proper name ...");
//         node.setDataValue(field, oldValue);
//         return;
//       }
//     }

//     if (field === "age") {
//       const numValue = Number(newValue);
//       if (isNaN(numValue) || numValue < 0 || numValue > 120) {
//         alert("Enter proper age ...");
//         node.setDataValue(field, oldValue);
//         return;
//       }
//     }

//     if (field === "dept") {
//       if (!newValue || newValue.trim() === "" || newValue.length > 50) {
//         alert("Enter proper dept ...");
//         node.setDataValue(field, oldValue);
//         return;
//       }
//     }

//     try {
//       await axios.put(`/update/${data?.regNo}`, data);
//     } catch (err) {
//       console.log(err);
//     }
//   };

//   const handleOpenModal = () => {
//     setAddModal({ ...initialState.addModal, show: true });
//   };

//   const handleCloseModal = () => {
//     setAddModal({ ...initialState.addModal });
//   };

//   const onBtFirst = useCallback(() => {
//     if (gridRef?.current?.paginationGoToFirstPage) {
//       gridRef.current.paginationGoToFirstPage();
//     }
//   }, []);

//   const onBtLast = useCallback(() => {
//     if (gridRef?.current?.paginationGoToLastPage) {
//       gridRef.current.paginationGoToLastPage();
//     }
//   }, []);

//   const onBtNext = useCallback(() => {
//     if (gridRef?.current?.paginationGoToNextPage) {
//       gridRef.current.paginationGoToNextPage();
//     }
//   }, []);

//   const onBtPrevious = useCallback(() => {
//     if (gridRef?.current?.paginationGoToPreviousPage) {
//       gridRef.current.paginationGoToPreviousPage();
//     }
//   }, []);

//   const onBtPageThree = useCallback(() => {
//     if (gridRef?.current?.paginationGoToPage) {
//       gridRef.current.paginationGoToPage(3);
//     }
//   }, []);

//   const handleSave = async () => {
//     const {
//       name = "",
//       dept = "",
//       regNo = "",
//       age = "",
//       dob = "",
//       phone = "",
//       state = "",
//       district = "",
//       courses = [],
//     } = addModal?.data || {};

//     if (!name.trim()) return alert("Name is required.");
//     if (!dept.trim()) return alert("Department is required.");
//     if (!dob) return alert("Date of Birth is required.");
//     if (!regNo || regNo < 0 || isNaN(regNo))
//       return alert("Valid Registration Number is required.");
//     if (!age || age < 0) return alert("Valid Age is required.");

//     if (addModal.editId === null) {
//       const exists = student.some((s) => s.regNo === regNo);
//       if (exists) return alert("Reg number already exists.");
//     }

//     try {
//       if (addModal.editId === null) {
//         const res = await axios.post("/add", addModal.data);
//         const newStudent = res?.data;

//         if (gridRef?.current?.applyTransaction) {
//           gridRef.current.applyTransaction({
//             add: [newStudent],
//           });
//         }
//       } else {
//         const res = await axios.put(
//           `/update/${addModal?.data?.regNo}`,
//           addModal.data
//         );
//         const updatedStudent = res?.data;
//         const updatedStudents = student.map((s) =>
//           s._id === addModal?.editId ? updatedStudent : s
//         );

//         if (gridRef?.current?.applyTransaction) {
//           gridRef.current.applyTransaction({
//             update: [updatedStudent],
//           });
//         }
//       }
//       handleCloseModal();
//     } catch (err) {
//       console.log(err);
//       if (err?.response?.data?.code === 11000) {
//         alert("Reg number already exists.");
//       } else {
//         console.log("Error", err.message);
//       }
//     }
//   };

//   const handleDelete = async ({ data }) => {
//     const regNo = data?.regNo;

//     try {
//       await axios.delete(`/delete/${regNo}`);
//     } catch (err) {
//       console.log("Delete error:", err.message);
//     }

//     if (gridRef?.current?.applyTransaction) {
//       gridRef.current.applyTransaction({
//         remove: [data],
//       });
//     }
//   };

//   const columnDefs = useMemo(
//     () => [
//       {
//         field: "",
//         width: 60,
//         cellRenderer: "agGroupCellRenderer",
//       },
//       {
//         headerName: "Name",
//         field: "name",
//         minWidth: 200,
//         flex: 1,
//         sortable: true,
//         filter: "agTextColumnFilter",
//         floatingFilter: "true",
//         editable: true,
//         cellEditor: "agTextCellEditor",
//         cellEditorPopup: true,
//         cellEditorParams: {
//           maxLength: 40,
//         },
//       },
//       {
//         headerName: "Age",
//         field: "age",
//         width: 200,
//         valueGetter: (params) => Number(params?.data?.age || ""),
//         sortable: true,
//         filter: "agNumberColumnFilter",
//         floatingFilter: "true",
//         editable: true,
//         cellEditor: "agNumberCellEditor",
//         cellEditorPopup: true,
//         cellEditorParams: {
//           maxLength: 40,
//         },
//       },
//       {
//         headerName: "DOB",
//         field: "dob",
//         width: 200,
//         sortable: true,
//         filter: "agDateColumnFilter",
//         floatingFilter: "true",
//         valueFormatter: (params) => {
//           return new Date(params?.data?.dob).toLocaleDateString("en-CA");
//         },
//         editable: true,
//         cellEditor: "agDateCellEditor",
//       },
//       {
//         headerName: "Dept",
//         field: "dept",
//         width: 200,
//         sortable: true,
//         filter: "agTextColumnFilter",
//         floatingFilter: "true",
//         editable: true,
//         cellEditor: "agSelectCellEditor",
//         cellEditorParams: {
//           values: ["ECE", "CSE", "MECH", "AIDS", "CSBS", "BIOTECH"],
//         },
//       },

//       {
//         headerName: "RegNo",
//         field: "regNo",
//         width: 200,
//         valueGetter: (params) => Number(params?.data?.regNo || 0),
//         sortable: true,
//         filter: "agNumberColumnFilter",
//         floatingFilter: "true",
//       },

//       {
//         headerName: "Actions",
//         width: 200,
//         cellRenderer: (params) => (
//           <div className="flex gap-4 p-2">
//             <button
//               className="bg-gray-800 rounded-md px-2 text-white"
//               onClick={() =>
//                 setAddModal({
//                   show: true,
//                   editId: params?.data?._id,
//                   data: { ...params?.data },
//                 })
//               }
//             >
//               Edit
//             </button>
//             <button
//               className="bg-gray-800 rounded-md px-2  text-white"
//               onClick={() => handleDelete(params)}
//             >
//               Delete
//             </button>
//           </div>
//         ),
//       },
//     ],
//     []
//   );

//   const detailCellRendererParams = useMemo(() => {
//     return {
//       detailGridOptions: {
//         columnDefs: [
//           {
//             field: "courses",
//             flex: 1,
//           },
//         ],
//       },

//       getDetailRowData: (params) => {
//         const courses = params?.data?.courses || [];
//         const course = courses.map((name) => ({
//           courses: name,
//         }));
//         if (params?.successCallback) params.successCallback(course);
//       },
//     };
//   }, []);

//   return (
//     <div className="p-6 w-[100%] bg-gray-600 min-h-screen">
//       <div className="flex justify-center items-center text-bold text-2xl  mb-7">
//         <h1 className="text-white">Student Details</h1>
//       </div>
//       <div className="flex items-center justify-between mb-5">
//         <input
//           className="rounded-xl px-2 py-3 bg-gray-500 border border-gray-800"
//           placeholder="   Search here..."
//           ref={gridRef}
//           onChange={(e) => {
//             if (gridRef?.current?.setGridOption) {
//               gridRef.current.setGridOption(
//                 "quickFilterText",
//                 e?.target?.value || ""
//               );
//             }
//           }}
//         ></input>
//         <div className="flex flex-wrap gap-3">
//           <button
//             className=" bg-gray-800 py-2 px-6 text-white rounded-xl"
//             onClick={onBtFirst}
//           >
//             To First
//           </button>
//           <button
//             className=" bg-gray-800 py-2 px-6 text-white rounded-xl"
//             onClick={onBtLast}
//           >
//             To Last
//           </button>
//           <button
//             className=" bg-gray-800 py-2 px-6 text-white rounded-xl"
//             onClick={onBtPrevious}
//           >
//             To Previous
//           </button>
//           <button
//             className=" bg-gray-800 py-2 px-6 text-white rounded-xl"
//             onClick={onBtNext}
//           >
//             To Next
//           </button>
//           <button
//             className=" bg-gray-800 py-2 px-6 text-white rounded-xl"
//             onClick={onBtPageThree}
//           >
//             To Page 3
//           </button>
//         </div>
//         <button
//           className=" bg-gray-800 py-2 px-6 text-white rounded-xl"
//           onClick={handleOpenModal}
//         >
//           Add
//         </button>
//       </div>

//       <div>
//         <AgGridReact
//           context={{}}
//           rowData={tableData}
//           columnDefs={columnDefs}
//           domLayout="autoHeight"
//           theme={myTheme}
//           getRowId={(params) => params?.data?._id || ""}
//           onGridReady={(params) => {
//             gridRef.current = params.api;
//             setTimeout(() => {
//               fetchStudents();
//             }, 200);
//           }}
//           onCellValueChanged={handleCellValueChange}
//           pagination={true}
//           paginationPageSize={5}
//           paginationPageSizeSelector={[5, 10, 20, 50, 100]}
//           stopEditingWhenCellsLoseFocus={true}
//           masterDetail={true}
//           detailCellRendererParams={detailCellRendererParams}

//           // onPaginationChanged={onPaginationChanged}
//           // suppressPaginationPanel={true}
//         />
//       </div>
//       <div>
//         <Modal
//           title={addModal.editId !== null ? "Edit Student" : "Add Student"}
//           open={addModal?.show || false}
//           onOk={handleSave}
//           onCancel={handleCloseModal}
//         >
//           <TextField
//             size="small"
//             variant="outlined"
//             label="Name"
//             fullWidth
//             required
//             style={{ marginTop: "20px" }}
//             value={addModal?.data?.name || ""}
//             onChange={(e) => {
//               const value = e?.target?.value || "";
//               if (value.length > 200) return;
//               setAddModal((prev) => ({
//                 ...prev,
//                 data: { ...prev.data, name: value },
//               }));
//             }}
//           />
//           <TextField
//             type="number"
//             size="small"
//             variant="outlined"
//             label="Age"
//             fullWidth
//             required
//             style={{ marginTop: "20px" }}
//             value={addModal?.data?.age || ""}
//             onChange={(e) => {
//               const value = Number(e?.target?.value) || "";
//               if (value < 0) alert("Age cannot less than 0 ...");
//               setAddModal((prev) => ({
//                 ...prev,
//                 data: { ...prev.data, age: value },
//               }));
//             }}
//           />
//           <TextField
//             type="date"
//             size="small"
//             variant="outlined"
//             label="DOB"
//             fullWidth
//             InputLabelProps={{ shrink: true }}
//             required
//             style={{ marginTop: "20px" }}
//             value={addModal?.data?.dob || ""}
//             onChange={(e) => {
//               const value = e?.target?.value || "";

//               setAddModal((prev) => ({
//                 ...prev,
//                 data: { ...prev.data, dob: value },
//               }));
//             }}
//           />
//           <TextField
//             size="small"
//             variant="outlined"
//             label="Department"
//             fullWidth
//             required
//             style={{ marginTop: "10px" }}
//             value={addModal?.data?.dept || ""}
//             onChange={(e) => {
//               const value = e?.target?.value || "";
//               if (value.length > 100) return;
//               setAddModal((prev) => ({
//                 ...prev,
//                 data: { ...prev.data, dept: value },
//               }));
//             }}
//           />
//           <TextField
//             size="small"
//             variant="outlined"
//             label="Reg No"
//             fullWidth
//             required
//             style={{ marginTop: "20px" }}
//             type="number"
//             value={addModal?.data?.regNo || ""}
//             onChange={(e) => {
//               const value = Number(e?.target?.value) || "";
//               if (value < 0) alert("Reg Numner cant negative ...");
//               setAddModal((prev) => ({
//                 ...prev,
//                 data: { ...prev.data, regNo: value },
//               }));
//             }}
//           />
//           <TextField
//             size="small"
//             variant="outlined"
//             label="Phone"
//             fullWidth
//             required
//             style={{ marginTop: "20px" }}
//             type="number"
//             value={addModal?.data?.phone || ""}
//             onChange={(e) => {
//               const value = Number(e?.target?.value) || "";
//               if (value.length < 0 || value.length > 10)
//                 alert("Enter valid Phone No ...");
//               setAddModal((prev) => ({
//                 ...prev,
//                 data: { ...prev.data, phone: value },
//               }));
//             }}
//           />
//           <TextField
//             size="small"
//             variant="outlined"
//             label="State"
//             fullWidth
//             required
//             style={{ marginTop: "20px" }}
//             value={addModal?.data?.state || ""}
//             onChange={(e) => {
//               const value = e?.target?.value || "";

//               setAddModal((prev) => ({
//                 ...prev,
//                 data: { ...prev.data, state: value },
//               }));
//             }}
//           />
//           <TextField
//             size="small"
//             variant="outlined"
//             label="District"
//             fullWidth
//             required
//             style={{ marginTop: "20px" }}
//             value={addModal?.data?.district || ""}
//             onChange={(e) => {
//               const value = e?.target?.value || "";

//               setAddModal((prev) => ({
//                 ...prev,
//                 data: { ...prev.data, district: value },
//               }));
//             }}
//           />
//           <div style={{ marginTop: "20px" }}>
//             <label className="font-bold mb-5">Courses:</label>
//             {["Python", "Java", "C++", "C", "CSS"].map((course) => (
//               <label
//                 key={course}
//                 style={{ display: "block", marginBottom: "5px" }}
//               >
//                 <input
//                   type="checkbox"
//                   value={course}
//                   checked={addModal?.data?.courses?.includes(course)}
//                   onChange={(e) => {
//                     const value = e?.target?.value;
//                     const isChecked = e?.target?.checked;

//                     setAddModal((prev) => {
//                       const currentCourses = prev?.data?.courses || [];
//                       const updatedCourses = isChecked
//                         ? [...currentCourses, value]
//                         : currentCourses.filter((c) => c !== value);

//                       return {
//                         ...prev,
//                         data: { ...prev.data, courses: updatedCourses },
//                       };
//                     });
//                   }}
//                 />{" "}
//                 {course}
//               </label>
//             ))}
//           </div>
//         </Modal>
//       </div>
//     </div>
//   );
// };

// export default Student;
