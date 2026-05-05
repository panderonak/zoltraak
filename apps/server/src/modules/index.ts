import { Router } from "express";
import { deliveryPersons } from "@/modules/delivery-persons";
import { inventories } from "@/modules/inventories";
import { orders } from "@/modules/orders";
import { products } from "@/modules/products";
import { warehouses } from "@/modules/warehouses";

const router: Router = Router();

router.use("/products", products);
router.use("/warehouses", warehouses);
router.use("/delivery-persons", deliveryPersons);
router.use("/inventories", inventories);
router.use("/orders", orders);

export { router };
