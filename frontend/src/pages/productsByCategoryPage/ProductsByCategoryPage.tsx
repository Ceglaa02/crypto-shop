import React, { useEffect, useContext, useState } from "react";

import { useParams } from "react-router-dom";
import Filters from "../../components/Products/productsPage/Filters";
import axios from "axios";
import { AppContext } from "../../state/AppContext";
import { mainPageProductsInterface } from "../../interfaces/product.interface";
import DisplayProducts from "../../components/Products/productsPage/DisplayProducts";
import { Row } from "react-bootstrap";

const ProductsByCategoryPage = () => {
  const { categoryId } = useParams();
  const [products, setproducts] = useState<mainPageProductsInterface[]>();

  const appcontext = useContext(AppContext);
  useEffect(() => {
    axios
      .get<mainPageProductsInterface[]>(
        `${appcontext?.backendUrl}/offer/offersincategory/${categoryId}`,
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      )
      .then((resp) => {
        console.log(resp);
        setproducts(resp.data);
      });

    return () => {};
  }, []);
  return (
    <div className="productsListPage">
      <Row>
        <Filters category={categoryId!} />
        <DisplayProducts products={products!} />
      </Row>
    </div>
  );
};

export default ProductsByCategoryPage;
