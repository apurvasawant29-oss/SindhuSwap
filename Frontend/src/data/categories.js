import { FiSmartphone, FiBookOpen, FiCpu, FiShoppingBag } from "react-icons/fi";
import { FaLaptop, FaTshirt, FaBicycle } from "react-icons/fa";
import { GiSofa } from "react-icons/gi";

const categories = [
  { name: "Mobiles", icon: FiSmartphone, tone: "blue" },
  { name: "Laptops", icon: FaLaptop, tone: "purple" },
  { name: "Furniture", icon: GiSofa, tone: "green" },
  { name: "Books", icon: FiBookOpen, tone: "yellow" },
  { name: "Electronics", icon: FiCpu, tone: "red" },
  { name: "Fashion", icon: FaTshirt, tone: "pink" },
  { name: "Sports", icon: FaBicycle, tone: "orange" },
  { name: "Others", icon: FiShoppingBag, tone: "gray" },
];

export default categories;
