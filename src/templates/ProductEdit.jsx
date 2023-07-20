import React, { useCallback, useState, useEffect } from "react"
import { TextInput, SelectBox, PrimaryButton } from "../components/UIkit"
import { ImageArea, SetSizeArea } from "../components/Products"
import { saveProduct } from "../reducks/products/operations"
import { useDispatch } from "react-redux"
import {db} from "../firebase/index"

function ProdictEdit() {

  const dispatch = useDispatch()
  let id = window.location.pathname.split("/product/edit")[1];

  //¤•iî•ñ‚ÌID‚¾‚¯‚ðŽæ‚èo‚·
  if (id !== "") {
    id = id.split("/")[1]
  }

  const [name, setName] = useState(""),
        [description, setDescription] = useState(""),
        [category, setCategory] = useState(""),
        [categories, setCategories] = useState([]),
        [gender, setGender] = useState(""),
        [images, setImages] = useState([]),
        [price, setPrice] = useState(""),
        [sizes, setSizes] = useState([]);

  const inputName = useCallback((event) => {
    setName(event.target.value)
  }, [setName]);

  const inputDescription = useCallback((event) => {
    setDescription(event.target.value)
  }, [setDescription]);

  const inputPrice = useCallback((event) => {
    setPrice(event.target.value)
  }, [setPrice]);

  const genders = [
    { id: "all", name: "All" },
    { id: "male", name: "Men" },
    { id: "female", name: "Women" },
  ];

  useEffect(() => {
    if (id !== "") {
      db.collection("products").doc(id).get()
        .then(snapshot => {
          const data = snapshot.data();
          setName(data.name);
          setDescription(data.description);
          setCategory(data.category);
          setGender(data.gender);
          setImages(data.images);
          setPrice(data.price);
          setSizes(data.sizes)
        })
    }
  }, [id]);

  useEffect(() => {
    db.collection("categories").orderBy("order", "asc").get()
      .then(snapshots => {
        const list = []
        snapshots.forEach(snapshot => {
          const data = snapshot.data()
          list.push({
            id: data.id,
            name: data.name
          })
        })
        setCategories(list)
      })
  },[])

  return (
    <section>
      <h2 className="u-text__headline u-text-center">Product Registration/Editing</h2>
      <div className="c-section-container">
        <ImageArea images={images} setImages={setImages} />
        <TextInput
          fullwidth={true} label={"Product Name"} multiline={false} required={true}
          onChange={inputName} minRows={1} value={name} type={"text"}
        />
        <TextInput
          fullwidth={true} label={"Product Description "} multiline={true} required={true}
          onChange={inputDescription} minRows={5} value={description} type={"text"}
        />
        <SelectBox
          label={"Category"} required={true} options={categories} select={setCategory} value={category}
        />
        <SelectBox
          label={"Gender"} required={true} options={genders} select={setGender} value={gender}
        />
        <TextInput
          fullwidth={true} label={"Price"} multiline={false} required={true}
          onChange={inputPrice} minRows={1} value={price} type={"number"}
        />
        <div className="module-spacer--small" />
        <SetSizeArea sizes={sizes} setSizes={setSizes} />
        <div className="module-spacer--small" />
        <div className="center">
          <PrimaryButton
            label={"Save"}
            onClick={() => dispatch(saveProduct(id, name, description, category, gender, price, images,sizes))}
          />
        </div>
      </div>
    </section>
  )
  
}
export default ProdictEdit