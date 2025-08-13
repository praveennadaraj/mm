const Student = require('../model/agmodel');

const addStudent = async (req, res) => {
  try {
    const student = new Student(req?.body);
    console.log("Incoming", req?.body)
    await student.save();
    res.status(200).json(student);
  } catch (err) {
    res.status(400).json(err)
    console.error("Error:", err);
  }
};

const getStudent = async (req, res) => {
  try {
    const students = await Student.find();
    res.status(200).json(students);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


const getStudentsServerSide = async (req, res) => {
  try {
    const {
      startRow,
      endRow,
      sortModel,
      filterModel,
      quickFilter
    } = req.body;

    console.log('Server-side request:', {
      startRow: parseInt(startRow),
      endRow: parseInt(endRow),
      sortModel: JSON.parse(sortModel || '[]'),
      filterModel: JSON.parse(filterModel || '{}'),
      quickFilter
    });

    let query = {};
    let sort = {};
    
    const totalCount = await Student.countDocuments(query);

   
    const skip = parseInt(startRow) || 0;
    const limit = (parseInt(endRow) || 10) - skip;

    const students = await Student.find(query)
      .skip(skip)
      .limit(limit)
      .exec();

    console.log(`Found ${students.length} students out of ${totalCount} total`);

    res.status(200).json({
      data: students,
      totalCount: totalCount
    });

  } catch (err) {
    console.error('Error in getStudentsServerSide:', err);
    res.status(500).json({ 
      error: 'Failed to fetch server-side data'
    });
  }
};

const updateStudent = async (req, res) => {
  try {
    const updated = await Student.findOneAndUpdate(
      { regNo: req?.params?.regNo },
      req?.body,
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const deleteStudent = async (req, res) => {
  try {
    await Student.findOneAndDelete({ regNo: req?.params?.regNo });
    res.json({ message: "Student deleted" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

module.exports = {
  addStudent,
  getStudent,
  getStudentsServerSide, 
  updateStudent,
  deleteStudent,
};