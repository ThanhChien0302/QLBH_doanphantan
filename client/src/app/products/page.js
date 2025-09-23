import ProductList from "../../components/ProductList";
import ProductForm from "../../components/ProductForm";

export default function ProductsPage() {
    const role = typeof window !== "undefined" ? localStorage.getItem("role") : null;

    const reload = () => window.location.reload();

    return (
        <div>
            <h1>Products</h1>
            {role === "admin" && <ProductForm onAdd={reload} />}
            <ProductList />
        </div>
    );
}
