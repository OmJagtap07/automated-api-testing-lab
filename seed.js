// seed.js
const mongoose = require('mongoose');
const Enrollment = require('./models/enrollment.model'); // Adjust path if needed

// 1. Connect to MongoDB (Make sure this string matches your index.js!)
mongoose.connect('mongodb://127.0.0.1:27017/my_database')
  .then(() => {
    console.log('Connected to MongoDB for seeding...');
    seedData();
  })
  .catch(err => console.log(err));

const seedData = async () => {
  try {
    // 2. Clear existing data (optional)
    await Enrollment.deleteMany({});
    console.log('Cleared existing enrollments...');

    // 3. Create dummy data
    // We will use 5 different Student IDs
    const students = [
      new mongoose.Types.ObjectId(), // Student A
      new mongoose.Types.ObjectId(), // Student B
      new mongoose.Types.ObjectId(), // Student C
      new mongoose.Types.ObjectId(), // Student D
      new mongoose.Types.ObjectId()  // Student E
    ];

    const enrollments = [
      // Student A (5 enrollments - Should be #1)
      { studentId: students[0], courseId: new mongoose.Types.ObjectId(), status: 'active' },
      { studentId: students[0], courseId: new mongoose.Types.ObjectId(), status: 'active' },
      { studentId: students[0], courseId: new mongoose.Types.ObjectId(), status: 'active' },
      { studentId: students[0], courseId: new mongoose.Types.ObjectId(), status: 'completed' },
      { studentId: students[0], courseId: new mongoose.Types.ObjectId(), status: 'dropped' },

      // Student B (3 enrollments - Should be #2)
      { studentId: students[1], courseId: new mongoose.Types.ObjectId(), status: 'active' },
      { studentId: students[1], courseId: new mongoose.Types.ObjectId(), status: 'active' },
      { studentId: students[1], courseId: new mongoose.Types.ObjectId(), status: 'completed' },

      // Student C (2 enrollments)
      { studentId: students[2], courseId: new mongoose.Types.ObjectId(), status: 'active' },
      { studentId: students[2], courseId: new mongoose.Types.ObjectId(), status: 'active' },

      // Student D (1 enrollment)
      { studentId: students[3], courseId: new mongoose.Types.ObjectId(), status: 'active' },

      // Student E (1 enrollment)
      { studentId: students[4], courseId: new mongoose.Types.ObjectId(), status: 'dropped' },
    ];

    // 4. Insert into Database
    await Enrollment.insertMany(enrollments);
    console.log('✅ Success! Added 12 dummy enrollments.');

    // 5. Close Connection
    mongoose.connection.close();
  } catch (error) {
    console.error('Error seeding data:', error);
  }
};