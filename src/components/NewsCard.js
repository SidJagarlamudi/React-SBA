import React from "react";
import cx from "clsx";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardMedia from "@material-ui/core/CardMedia";
import CardContent from "@material-ui/core/CardContent";
import TextInfoContent from "@mui-treasury/components/content/textInfo";
import { useBouncyShadowStyles } from "@mui-treasury/styles/shadow/bouncy";
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";
import Iframe from "react-iframe";
import { useState, useEffect } from "react";

function useWindowSize() {
  const [windowSize, setWindowSize] = useState({
    width: undefined,
    height: undefined,
  });
  useEffect(() => {
    function handleResize() {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  return windowSize;
}

const useStyles = makeStyles(() => ({
  root: {
    margin: "auto",
    borderRadius: 0,
    backgroundColor: "#303030",
  },
  content: {
    padding: 24,
  },
  cta: {
    marginTop: 24,
    textTransform: "initial",
  },
}));
const useStyles2 = makeStyles((theme) => ({
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  paper: {
    backgroundColor: "#424242",
    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));
const whiteTextStyle = makeStyles(() => ({
  overline: {
    textTransform: "uppercase",
    color: "#FFFFFF",
    letterSpacing: "1px",
    fontSize: 12,
    marginBottom: "0.875em",
    display: "inline-block",
  },
  heading: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: "0.4em",
    color: "#FFFFFF",
  },
  body: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.7)",
  },
}));

export function NewsCard(props) {
  const size = useWindowSize();
  const width = size.width;
  const height = size.height;
  const styles = useStyles();
  const textStyles = whiteTextStyle();
  const modalStyles = useStyles2();
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const shadowStyles = useBouncyShadowStyles();
  console.log("step 2");
  console.log(props.article);
  const randomImgHeight = Math.floor(Math.random() * (400 - 200 + 1)) + 200;
  return (
    <Card className={cx(styles.root, shadowStyles.root)}>
      <CardMedia
        style={{ height: `${randomImgHeight}px` }}
        className="news-img"
        image={props.article.image.url}
      />
      <CardContent>
        <TextInfoContent
          classes={textStyles}
          overline={
            "published on: " +
            props.article.datePublished.substring(0, 10) +
            ", by: " +
            props.article.provider.name
          }
          heading={props.article.title.replace(/<(.|\n)*?>/g, '')}
          body={props.article.description.replace(/<(.|\n)*?>/g, '')}
        />
        <div>
          <button onClick={handleOpen} class="button  arrow">
            Read more
          </button>
        </div>
        <Modal
          aria-labelledby="transition-modal-title"
          aria-describedby="transition-modal-description"
          className={modalStyles.modal}
          open={open}
          onClose={handleClose}
          closeAfterTransition
          BackdropComponent={Backdrop}
          BackdropProps={{
            timeout: 500,
          }}
        >
          <Fade in={open}>
            <div className={modalStyles.paper}>
              <a href={props.article.url} id="transition-modal-title">
                {props.article.title.replace(/<(.|\n)*?>/g, '')}{" "}
              </a>
              <p class="pub-date">
                {"published on: " +
                  props.article.datePublished.substring(0, 10) +
                  ", by: " +
                  props.article.provider.name}
              </p>
              <p id="transition-modal-description">
                <Iframe
                  url={props.article.url}
                  width={width * 0.7 + "px"}
                  height={height * 0.8 + "px"}
                  id="myId"
                  className="myClassname"
                  display="initial"
                  position="relative"
                />
              </p>
            </div>
          </Fade>
        </Modal>
      </CardContent>
    </Card>
  );
}

export default NewsCard;
