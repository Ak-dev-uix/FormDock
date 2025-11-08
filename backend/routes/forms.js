import express from "express";
import { nanoid } from "nanoid";
import { usersDB, formsDB } from "../database.js";

const router = express.Router();

// ✅ Create Form
router.post("/create", async (req, res) => {
  try {
    const { title, userId } = req.body;

    if (!title || !userId) {
      return res.status(400).json({ message: "Title and userId required" });
    }

    await usersDB.read();
    const user = usersDB.data.find(u => u.id === userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    await formsDB.read();
    const newForm = {
      id: nanoid(),
      title: title.trim(),
      userId,
      submissions: [],
      createdAt: new Date().toISOString()
    };

    formsDB.data.push(newForm);
    await formsDB.write();

    res.status(201).json({
      message: "Form created successfully",
      form: newForm
    });

  } catch (error) {
    console.error("Create form error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Get User's Forms
router.get("/user/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    await formsDB.read();
    const userForms = formsDB.data.filter(f => f.userId === userId);

    res.json(userForms);

  } catch (error) {
    console.error("Get forms error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Submit Form Response
router.post("/:formId/submit", async (req, res) => {
  try {
    const { formId } = req.params;
    const { responses } = req.body;

    if (!formId || !responses) {
      return res.status(400).json({ message: "Form ID and responses required" });
    }

    await formsDB.read();
    const form = formsDB.data.find(f => f.id === formId);
    if (!form) {
      return res.status(404).json({ message: "Form not found" });
    }

    const submission = {
      id: nanoid(),
      formId,
      responses,
      submittedAt: new Date().toISOString()
    };

    form.submissions.push(submission);
    await formsDB.write();

    res.json({
      message: "Form submitted successfully",
      submissionId: submission.id
    });

  } catch (error) {
    console.error("Submit form error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Get Form Submissions
router.get("/:formId/submissions", async (req, res) => {
  try {
    const { formId } = req.params;

    await formsDB.read();
    const form = formsDB.data.find(f => f.id === formId);

    if (!form) {
      return res.status(404).json({ message: "Form not found" });
    }

    res.json(form.submissions || []);

  } catch (error) {
    console.error("Get submissions error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Delete Form
router.delete("/:formId", async (req, res) => {
  try {
    const { formId } = req.params;

    await formsDB.read();
    const formIndex = formsDB.data.findIndex(f => f.id === formId);

    if (formIndex === -1) {
      return res.status(404).json({ message: "Form not found" });
    }

    formsDB.data.splice(formIndex, 1);
    await formsDB.write();

    res.json({ message: "Form deleted successfully" });

  } catch (error) {
    console.error("Delete form error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
