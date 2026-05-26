import ProductReel from "@/app/(main)/products/_components/product-reel";
import { MaxWidthWrapper } from "@/components/max-width-wrapper";

const ProductsPage = () => {
	return (
		<MaxWidthWrapper>
			<ProductReel title="Browse Products" />
		</MaxWidthWrapper>
	);
};

export default ProductsPage;
