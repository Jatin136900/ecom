import instance from "../config/axiosConfig";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useCart } from "../contexts/CartProvider";

function SingleProduct() {
  const { id } = useParams();

  const {cart, setCart} = useCart();

  const [singleProduct, setSingleProduct] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  

  useEffect(() => {
    getSingleData(id);
  }, [id]);

  useEffect(() => {
    localStorage.setItem("storedCart", JSON.stringify(cart));
  }, [cart]);

  async function getSingleData(id) {
    try {
      setLoading(true);
      const response = await instance.get("/product/product/" + id);
      if (response.data.length === 0) {
        setLoading(false);
        setError("Check the ID parameter");
      } else {
        setSingleProduct(response.data);
        setLoading(false);
      }
    } catch (error) {
      console.log(error);
      setError("Check the ID parameter");
      setLoading(false);
    }
  }

  async function handleAddToCart(idToAdd) {
    setCart([...cart, { id: idToAdd, quantity: 1 }]);
  }

  console.log(cart);

  if (loading) return <div className="loader">Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <>
      <section className="singleProduct">
        <div className="left">
          <img src={singleProduct.image} alt={singleProduct.name} />
        </div>
        <div className="right">
          <h2>{singleProduct.name}</h2>
          <p>{singleProduct.cateogry}</p>
          <h4>{singleProduct.price}</h4>
          <p className="desc">{singleProduct.description}</p>
          <button onClick={() => handleAddToCart(singleProduct._id)}>
            Add To Cart
          </button>
        </div>
      </section>
    </>
  );
}

export default SingleProduct;
