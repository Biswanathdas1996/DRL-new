import React, { useEffect, useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../redux/store";
import { addLLMReply } from "../redux/slices/chatSlices";
import { QueryData } from "../types/LLM";
import Table from "./Table";
import Analyse from "./Analyse";
import SqlUpdate from "./SqlUpdate";
import { SAVE_QUERY, FEEDBACK } from "../config";
import { useAlert } from "../hook/useAlert";
import { useFetch } from "../hook/useFetch";
import Loader from "./Loader";
import { UserContext } from "../App";
import ThumbUpOffAltIcon from "@mui/icons-material/ThumbUpOffAlt";
import ThumbDownOffAltIcon from "@mui/icons-material/ThumbDownOffAlt";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import DRL_ICON from "../assets/images/icon.png";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { TextField } from "@mui/material";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  borderRadius: 3,
};

interface LlmReplyProps {
  chat: {
    id: number;
    type: string;
    message: QueryData;
    time: string;
  };
}

const LlmReply: React.FC<LlmReplyProps> = ({ chat }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { message, time, id } = chat;
  const fetchData = useFetch();
  const [loadingUi, setLoadingUi] = React.useState<boolean>(false);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [error, setError] = React.useState<boolean>(false);

  const [givenFeedback, setGivenFeedback] = React.useState<number>();
  const [comment, setComment] = React.useState<string>("");

  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const { triggerAlert } = useAlert();

  const feedback = () => {
    setError(false);
    if (givenFeedback === 0 && comment.trim() === "") {
      triggerAlert("Comment is mandatory for negative feedback", "error");
      setError(true);
      return;
    }
    setLoading(true);
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
      id: message?.log_id,
      feedback: givenFeedback,
      comment: comment,
    });

    var requestOptions: RequestInit = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow" as RequestRedirect,
    };

    fetch(FEEDBACK, requestOptions)
      .then((response) => response.text())
      .then((result) => {
        setLoading(false);
        triggerAlert("Feedback recorded", "success");
      })
      .catch((error) => {
        setLoading(false);
        console.log("error", error);
      })
      .finally(() => {
        handleClose();
      });
  };

  return (
    <div>
      <div>
        <Modal
          aria-labelledby="transition-modal-title"
          aria-describedby="transition-modal-description"
          open={open}
          onClose={handleClose}
          closeAfterTransition
          slots={{ backdrop: Backdrop }}
          slotProps={{
            backdrop: {
              timeout: 500,
            },
          }}
        >
          <Fade in={open}>
            <Box sx={style}>
              <Typography
                id="transition-modal-title"
                variant="h6"
                component="h2"
              >
                {givenFeedback === 1
                  ? "Thank you for your feedback"
                  : "Sorry for the inconvenience"}
              </Typography>

              <TextField
                placeholder="Provide your comments here"
                multiline
                rows={4}
                variant="outlined"
                fullWidth
                margin="normal"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />

              {error && <p style={{ color: "red" }}>Please give a comment</p>}

              {!loading ? (
                <Button
                  variant="contained"
                  color="primary"
                  id="temp_button"
                  onClick={() => {
                    feedback();
                  }}
                >
                  Submit
                </Button>
              ) : (
                <div style={{ display: "flex", justifyContent: "flex-end" }}>
                  <b>Saving Feedback...</b>
                </div>
              )}
            </Box>
          </Fade>
        </Modal>
      </div>
      {!loading ? (
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <ThumbUpIcon
            style={{ margin: 4, fontSize: 22, cursor: "pointer" }}
            onClick={() => {
              handleOpen();
              setGivenFeedback(1);
            }}
          />
          <ThumbDownOffAltIcon
            style={{ margin: 4, fontSize: 22, cursor: "pointer" }}
            onClick={() => {
              handleOpen();
              setGivenFeedback(0);
            }}
          />
        </div>
      ) : (
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <b>Saving Feedback...</b>
        </div>
      )}
    </div>
  );
};

export default LlmReply;
