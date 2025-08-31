import React, {
  useState,
  useEffect,
  useMemo,
  useRef,
  useCallback,
} from "react";
import axios from "./axios";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-enterprise";
import { Button, Modal } from "antd";
import { TextField } from "@mui/material";
import { themeQuartz } from "ag-grid-community";

const initialState = {
  addModal: {
    show: false,
    editId: null,
    data: {
      name: "",
      dept: "",
      regNo: "",
      age: "",
      dob: "",
      phone: "",
      state: "",
      district: "",
      courses: [],
    },
  },
};

const detailCellRenderer = (params) => {
  console.log("PARAMS:", params);
  const { data, api } = params;
  const [courseModal, setCourseModal] = useState({
    show: false,
    studentId: null,
    studentName: "",
    courses: [],
  });

  const handleManageCourses = () => {
    setCourseModal({
      show: true,
      studentId: data?._id,
      studentName: data?.name,
      courses: data?.courses || [],
    });
  };

  const handleCloseCourseModal = () => {
    setCourseModal({
      show: false,
      studentId: null,
      studentName: "",
      courses: [],
    });
  };

  const handleSaveCourses = async () => {
    try {
      const updatedData = { ...data, courses: courseModal.courses };
      await axios.put(`/update/${data.regNo}`, updatedData);

      if (api) {
        api?.refreshServerSide({ route: [], purge: false });
      }

      handleCloseCourseModal();
    } catch (err) {
      console.error("Error updating courses:", err);
    }
  };

  const courses = data?.courses || [];
  const courseData = courses.map((name, index) => ({
    courseId: `C00${index + 1}`,
    courseName: name,
  }));

  const columnDefs = [
    {
      headerName: "Course Name",
      field: "courseName",
      flex: 1,
    },
  ];

  const myTheme = themeQuartz.withParams({
    backgroundColor: "#1f2836",
    browserColorScheme: "dark",
    chromeBackgroundColor: {
      ref: "foregroundColor",
      mix: 0.07,
      onto: "backgroundColor",
    },
    foregroundColor: "#FFF",
    headerFontSize: 14,
  });

  return (
    <div className="p-5 bg-gray-800">
      <div className="flex justify-between items-center py-2.5 border-b border-[#404854] mb-4">
        <h3 className="text-white m-0 text-base font-bold">
          Enrolled Courses of {data?.name}
        </h3>
        <button
          className="bg-[#1677ff] text-white border-none px-4 py-2 rounded-md cursor-pointer text-sm font-medium"
          onClick={handleManageCourses}
        >
          Edit Courses
        </button>
      </div>

      <div className="h-[300px] w-full">
        <AgGridReact
          rowData={courseData}
          columnDefs={columnDefs}
          theme={myTheme}
          domLayout="autoHeight"
          defaultColDef={{
            sortable: true,
            filter: true,
          }}
          suppressRowClickSelection={true}
          getRowId={(params) => params.data.courseId}
        />
      </div>

      <Modal
        title={`Manage Courses - ${courseModal.studentName}`}
        open={courseModal.show}
        onOk={handleSaveCourses}
        onCancel={handleCloseCourseModal}
        width={600}
      >
        <div className="mt-5">
          <label className="font-bold mb-4 block">Available Courses:</label>
          {[
            "Python",
            "Java",
            "C++",
            "C",
            "CSS",
            "JavaScript",
            "React",
            "Node.js",
          ].map((course) => (
            <label key={course} className="block mb-2 text-sm">
              <input
                type="checkbox"
                value={course}
                checked={courseModal.courses.includes(course)}
                onChange={(e) => {
                  const value = e?.target?.value;
                  const isChecked = e?.target?.checked;

                  setCourseModal((prev) => {
                    const currentCourses = prev?.courses || [];
                    const updatedCourses = isChecked
                      ? [...currentCourses, value]
                      : currentCourses.filter((c) => c !== value);

                    return {
                      ...prev,
                      courses: updatedCourses,
                    };
                  });
                }}
                className="mr-2"
              />
              {course}
            </label>
          ))}
        </div>
      </Modal>
    </div>
  );
};

const Student = () => {
  const [addModal, setAddModal] = useState(initialState.addModal);
  const gridRef = useRef();

  const myTheme = themeQuartz.withParams({
    backgroundColor: "#1f2836",
    browserColorScheme: "dark",
    chromeBackgroundColor: {
      ref: "foregroundColor",
      mix: 0.07,
      onto: "backgroundColor",
    },
    foregroundColor: "#FFF",
    headerFontSize: 14,
  });

  const getServerSideDatasource = () => {
    return {
      getRows: async (params) => {
        console.log("Server side request params:", params?.request);

        try {
          const { startRow, endRow, sortModel, filterModel } = params?.request;

          const bodyData = {
            startRow,
            endRow,
            sortModel: JSON.stringify(sortModel),
            filterModel: JSON.stringify(filterModel),
          };

          // const quickFilterText = gridRef?.current?.getQuickFilter?.();
          // if (quickFilterText) {
          //   queryParams.quickFilter = quickFilterText;
          // }

          const response = await axios.post("/getServerSide", bodyData);

          const { data, totalCount } = response.data;

          params.success({
            rowData: data,
            rowCount: totalCount,
          });
        } catch (error) {
          console.error("Error fetching server-side data:", error);
          params.fail();
        }
      },
    };
  };

  const handleCellValueChange = async (params) => {
    const { colDef, newValue, oldValue, data, node } = params;
    const field = colDef.field;

    if (field === "name") {
      if (!newValue || newValue.trim() === "" || newValue.length > 200) {
        alert("Enter proper name ...");
        node.setDataValue(field, oldValue);
        return;
      }
    }

    if (field === "age") {
      const numValue = Number(newValue);
      if (isNaN(numValue) || numValue < 0 || numValue > 120) {
        alert("Enter proper age ...");
        node.setDataValue(field, oldValue);
        return;
      }
    }

    if (field === "dept") {
      if (!newValue || newValue.trim() === "" || newValue.length > 50) {
        alert("Enter proper dept ...");
        node.setDataValue(field, oldValue);
        return;
      }
    }

    try {
      await axios.put(`/update/${data?.regNo}`, data);

      if (gridRef?.current) {
        gridRef?.current?.refreshServerSide({ route: [], purge: false });
      }
    } catch (err) {
      console.log(err);

      node.setDataValue(field, oldValue);
    }
  };

  const handleOpenModal = () => {
    setAddModal({ ...initialState.addModal, show: true });
  };

  const handleCloseModal = () => {
    setAddModal({ ...initialState.addModal });
  };

  const onBtFirst = useCallback(() => {
    if (gridRef?.current?.paginationGoToFirstPage) {
      gridRef.current.paginationGoToFirstPage();
    }
  }, []);

  const onBtLast = useCallback(() => {
    if (gridRef?.current?.paginationGoToLastPage) {
      gridRef.current.paginationGoToLastPage();
    }
  }, []);

  const onBtNext = useCallback(() => {
    if (gridRef?.current?.paginationGoToNextPage) {
      gridRef.current.paginationGoToNextPage();
    }
  }, []);

  const onBtPrevious = useCallback(() => {
    if (gridRef?.current?.paginationGoToPreviousPage) {
      gridRef.current.paginationGoToPreviousPage();
    }
  }, []);

  const onBtPageThree = useCallback(() => {
    if (gridRef?.current?.paginationGoToPage) {
      gridRef.current.paginationGoToPage(3);
    }
  }, []);

  const handleSave = async () => {
    const {
      name = "",
      dept = "",
      regNo = "",
      age = "",
      dob = "",
    } = addModal?.data || {};

    if (!name.trim()) return alert("Name is required.");
    if (!dept.trim()) return alert("Department is required.");
    if (!dob) return alert("Date of Birth is required.");
    if (!regNo || regNo < 0 || isNaN(regNo))
      return alert("Valid Registration Number is required.");
    if (!age || age < 0) return alert("Valid Age is required.");

    try {
      if (addModal.editId === null) {
        await axios.post("/add", addModal.data);
      } else {
        await axios.put(`/update/${addModal?.data?.regNo}`, addModal.data);
      }

      if (gridRef?.current) {
        gridRef?.current?.refreshServerSide({ route: [], purge: true });
      }

      handleCloseModal();
    } catch (err) {
      console.log(err);
      if (err?.response?.data?.code === 11000) {
        alert("Reg number already exists.");
      } else {
        console.log("Error", err.message);
      }
    }
  };

  const handleDelete = async ({ data }) => {
    const regNo = data?.regNo;

    try {
      await axios.delete(`/delete/${regNo}`);

      if (gridRef?.current?.refreshServerSide) {
        gridRef.current.refreshServerSide({ route: [], purge: false });
      }
    } catch (err) {
      console.log("Delete error:", err.message);
    }
  };

  const columnDefs = useMemo(
    () => [
      {
        field: "",
        width: 60,
        cellRenderer: "agGroupCellRenderer",
      },
      {
        headerName: "Name",
        field: "name",
        minWidth: 200,
        flex: 1,
        sortable: true,
        filter: "agTextColumnFilter",
        floatingFilter: true,
        editable: true,
        cellEditor: "agTextCellEditor",
        cellEditorPopup: true,
        cellEditorParams: {
          maxLength: 40,
        },
      },
      {
        headerName: "Age",
        field: "age",
        width: 150,
        valueGetter: (params) => Number(params?.data?.age || ""),
        sortable: true,
        filter: "agNumberColumnFilter",
        floatingFilter: true,
        editable: true,
        cellEditor: "agNumberCellEditor",
        cellEditorPopup: true,
        cellEditorParams: {
          maxLength: 40,
        },
      },
      {
        headerName: "DOB",
        field: "dob",
        width: 200,
        sortable: true,
        filter: "agDateColumnFilter",
        floatingFilter: true,
        valueFormatter: (params) => {
          return new Date(params?.data?.dob).toLocaleDateString("en-CA");
        },
        editable: true,
        cellEditor: "agDateCellEditor",
      },
      {
        headerName: "Dept",
        field: "dept",
        width: 200,
        sortable: true,
        filter: "agTextColumnFilter",
        floatingFilter: true,
        editable: true,
        cellEditor: "agSelectCellEditor",
        cellEditorParams: {
          values: ["ECE", "CSE", "MECH", "AIDS", "CSBS", "BIOTECH"],
        },
      },
      {
        headerName: "RegNo",
        field: "regNo",
        width: 200,
        valueGetter: (params) => Number(params?.data?.regNo || 0),
        sortable: true,
        filter: "agNumberColumnFilter",
        floatingFilter: true,
      },
      {
        headerName: "Actions",
        width: 200,
        sortable: false,
        filter: false,
        cellRenderer: (params) => (
          <div className="flex gap-4 p-2">
            <button
              className="bg-gray-800 rounded-md px-2 text-white"
              onClick={() =>
                setAddModal({
                  show: true,
                  editId: params?.data?._id,
                  data: { ...params?.data },
                })
              }
            >
              Edit
            </button>
            <button
              className="bg-gray-800 rounded-md px-2  text-white"
              onClick={() => handleDelete(params)}
            >
              Delete
            </button>
          </div>
        ),
      },
    ],
    []
  );

  return (
    <div className="p-6 w-[100%] bg-gray-600 min-h-screen">
      <div className="flex justify-center items-center text-bold text-2xl  mb-7">
        <h1 className="text-white">Student Details</h1>
      </div>
      <div className="flex items-center justify-between mb-5">
        <input
          className="rounded-xl px-2 py-3 bg-gray-500 border border-gray-800"
          placeholder="   Search here..."
          onChange={(e) => {
            if (gridRef?.current?.setGridOption) {
              gridRef.current.setGridOption(
                "quickFilterText",
                e?.target?.value || ""
              );
            }
          }}
        />
        <div className="flex flex-wrap gap-3">
          <button
            className=" bg-gray-800 py-2 px-6 text-white rounded-xl"
            onClick={onBtFirst}
          >
            To First
          </button>
          <button
            className=" bg-gray-800 py-2 px-6 text-white rounded-xl"
            onClick={onBtLast}
          >
            To Last
          </button>
          <button
            className=" bg-gray-800 py-2 px-6 text-white rounded-xl"
            onClick={onBtPrevious}
          >
            To Previous
          </button>
          <button
            className=" bg-gray-800 py-2 px-6 text-white rounded-xl"
            onClick={onBtNext}
          >
            To Next
          </button>
          <button
            className=" bg-gray-800 py-2 px-6 text-white rounded-xl"
            onClick={onBtPageThree}
          >
            To Page 3
          </button>
        </div>
        <button
          className=" bg-gray-800 py-2 px-6 text-white rounded-xl"
          onClick={handleOpenModal}
        >
          Add
        </button>
      </div>

      <div>
        <AgGridReact
          context={{}}
          columnDefs={columnDefs}
          domLayout="autoHeight"
          theme={myTheme}
          getRowId={(params) => params?.data?._id || ""}
          onGridReady={(params) => {
            gridRef.current = params.api;

            const datasource = getServerSideDatasource();
            params.api.setGridOption("serverSideDatasource", datasource);
          }}
          onCellValueChanged={handleCellValueChange}
          pagination={true}
          paginationPageSize={5}
          paginationPageSizeSelector={[5, 10, 20, 50, 100]}
          stopEditingWhenCellsLoseFocus={true}
          masterDetail={true}
          detailCellRenderer={detailCellRenderer}
          detailRowHeight={400}
          rowModelType="serverSide"
          serverSideInitialRowCount={1}
          cacheBlockSize={10}
          maxBlocksInCache={10}
          suppressServerSideInfiniteScroll={true}
          rowSelection="multiple"
          defaultColDef={{
            sortable: true,
            filter: true,
            resizable: true,
            floatingFilter: true,
          }}
          serverSideStoreType="full"
        />
      </div>

      <div>
        <Modal
          title={addModal.editId !== null ? "Edit Student" : "Add Student"}
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
            style={{ marginTop: "20px" }}
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
            style={{ marginTop: "20px" }}
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
            type="date"
            size="small"
            variant="outlined"
            label="DOB"
            fullWidth
            InputLabelProps={{ shrink: true }}
            required
            style={{ marginTop: "20px" }}
            value={addModal?.data?.dob || ""}
            onChange={(e) => {
              const value = e?.target?.value || "";

              setAddModal((prev) => ({
                ...prev,
                data: { ...prev.data, dob: value },
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
              if (value.length > 100) return;
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
            style={{ marginTop: "20px" }}
            type="number"
            value={addModal?.data?.regNo || ""}
            onChange={(e) => {
              const value = Number(e?.target?.value) || "";
              if (value < 0) alert("Reg Numner cant negative ...");
              setAddModal((prev) => ({
                ...prev,
                data: { ...prev.data, regNo: value },
              }));
            }}
          />
          <TextField
            size="small"
            variant="outlined"
            label="Phone"
            fullWidth
            required
            style={{ marginTop: "20px" }}
            type="number"
            value={addModal?.data?.phone || ""}
            onChange={(e) => {
              const value = Number(e?.target?.value) || "";
              if (value.length < 0 || value.length > 10)
                alert("Enter valid Phone No ...");
              setAddModal((prev) => ({
                ...prev,
                data: { ...prev.data, phone: value },
              }));
            }}
          />
          <TextField
            size="small"
            variant="outlined"
            label="State"
            fullWidth
            required
            style={{ marginTop: "20px" }}
            value={addModal?.data?.state || ""}
            onChange={(e) => {
              const value = e?.target?.value || "";

              setAddModal((prev) => ({
                ...prev,
                data: { ...prev.data, state: value },
              }));
            }}
          />
          <TextField
            size="small"
            variant="outlined"
            label="District"
            fullWidth
            required
            style={{ marginTop: "20px" }}
            value={addModal?.data?.district || ""}
            onChange={(e) => {
              const value = e?.target?.value || "";

              setAddModal((prev) => ({
                ...prev,
                data: { ...prev.data, district: value },
              }));
            }}
          />
          <div style={{ marginTop: "20px" }}>
            <label className="font-bold mb-5">Courses:</label>
            {["Python", "Java", "C++", "C", "CSS"].map((course) => (
              <label
                key={course}
                style={{ display: "block", marginBottom: "5px" }}
              >
                <input
                  type="checkbox"
                  value={course}
                  checked={addModal?.data?.courses?.includes(course)}
                  onChange={(e) => {
                    const value = e?.target?.value;
                    const isChecked = e?.target?.checked;

                    setAddModal((prev) => {
                      const currentCourses = prev?.data?.courses || [];
                      const updatedCourses = isChecked
                        ? [...currentCourses, value]
                        : currentCourses.filter((c) => c !== value);

                      return {
                        ...prev,
                        data: { ...prev.data, courses: updatedCourses },
                      };
                    });
                  }}
                />{" "}
                {course}
              </label>
            ))}
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default Student;
