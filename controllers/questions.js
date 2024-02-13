import Questions from "../models/questions.js";
import mongoose from "mongoose";

export const askQuestion = async (req, res) => {
  const postQuestion = new Questions(req.body)

  try {
    await postQuestion.save()
    res.status(200).json('Question posted successfully')
  } catch (error) {
    console.log(error)
    res.status(500).json("Couldn't post a new question");
  }
}

export const getAllQuestions = async (req, res) => {
  try {
    const questionList = await Questions.find().sort({ askedOn: -1 });
    res.status(200).json(questionList);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const deleteQuestion = async (req, res) => {
  const { id: _id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(_id)) {
    return res.status(404).send("Question unavailable...");
  }
  try {
    // await Questions.findByIdAndRemove(_id);
    console.log(req.params.id," ",_id);
    res.status(200).json({ message: "Question successfully deleted..."});
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const voteQuestion = async (req, res) => {
  const { id: _id } = req.params;
  const { value, userId } = req.body;

  if (!mongoose.Types.ObjectId.isValid(_id)) {
    return res.status(404).send("Question unavailable...");
  }

  try {
    const question = await Questions.findById(_id);
    /*
    This function manages user voting on a question. It checks if the user has already voted (upvoted or downvoted) by looking for their userId in the corresponding arrays. If the user switches their vote (e.g., from downvote to upvote), their userId is removed from the opposite array. If the user hasn't voted in the same way before, their userId is added to the respective array. If the user has already voted in the same way, their userId is removed, canceling their previous vote.
    */
    const upIndex = question.upVote.findIndex((id) => id === String(userId));
    const downIndex = question.downVote.findIndex((id) => id === String(userId));

    if (value === "upVote") {
      if (downIndex !== -1) {
        question.downVote = question.downVote.filter(
          (id) => id !== String(userId)
        );
      }
      if (upIndex === -1) {
        question.upVote.push(userId);
      } else {
        question.upVote = question.upVote.filter((id) => id !== String(userId));
      }
    } else if (value === "downVote") {
      if (upIndex !== -1) {
        question.upVote = question.upVote.filter((id) => id !== String(userId));
      }
      if (downIndex === -1) {
        question.downVote.push(userId);
      } else {
        question.downVote = question.downVote.filter(
          (id) => id !== String(userId)
        );
      }
    }
    await Questions.findByIdAndUpdate(_id, question);
    res.status(200).json({ message: "Voted successfully..." });
  } catch (error) {
    res.status(404).json({ message: "Id not found" });
  }
};