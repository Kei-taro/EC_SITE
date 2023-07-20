import React, { useCallback } from "react"
import IconButton from "@material-ui/core/IconButton"
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import { makeStyles} from "@material-ui/styles"
import { storage } from "../../firebase/index"
import { ImagePreview } from "./index"

const useStyle = makeStyles({
  icon: {
    height: 48,
    width: 48
  }
})

function ImageArea(props) {

  console.log("ImageArea")
  const classes = useStyle();

  const deleteImage = useCallback(async (id) => {
    const ret = window.confirm("Delete image?");
    if (!ret) {
      return false
    }
    else {
      const newImages = props.images.filter(image => image.id !== id)
      props.setImages(newImages);
      return storage.ref("images").child(id).delete()
    }
  },[props.images])

  const uploadImage = useCallback((event) => {
    const file = event.target.files;
    let blob = new Blob(file, { type: "image/jpeg" });

    //ランダムに16文字のファイル名を作成
    const S = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    const N = 16;
    const fileName = Array.from(crypto.getRandomValues(new Uint32Array(N))).map((n) => S[n % S.length]).join("");

    const uploadRef = storage.ref("images").child(fileName);
    const uploadTask = uploadRef.put(blob);

    //画像をFirebase Strorageに保存するためGoogleCloudSdkをインストール
    //cors.jsonに"CORS構成"を作成
    //FirebaseRulesも編集
    uploadTask.then(() => {
      uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
        const newImage = { id: fileName, path: downloadURL };
        props.setImages((prevState => [...prevState, newImage]))
      });
    })
  }, [props.setImages]);
    
  return (
    <div>
      <div className= "p-grid__list-images">
        {props.images.length > 0 && (
          props.images.map(image =>
            <ImagePreview delete={deleteImage} id={image.id} path={image.path} key={image.id} />)
        )}
      </div>
      <div className="u-text-right">
        <span>Image Registration</span>
        <IconButton className={classes.icon}>
          <label>
            <AddPhotoAlternateIcon />
            <input className="u-display-none" type="file" id="image"
              onChange={(event) => uploadImage(event)}
            />
          </label>
        </IconButton>
      </div>
    </div>
  )
}

export default ImageArea