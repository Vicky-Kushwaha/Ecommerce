import { useState } from "react";
import "./sidebar.css";
import { useNavigate } from "react-router-dom";
import { SimpleTreeView } from "@mui/x-tree-view/SimpleTreeView";
import { TreeItem } from "@mui/x-tree-view/TreeItem";
import PostAddIcon from "@mui/icons-material/PostAdd";
import AddIcon from "@mui/icons-material/Add";
import ListAltIcon from "@mui/icons-material/ListAlt";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PeopleIcon from "@mui/icons-material/People";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";

const Sidebar = ({ content }) => {
  const navigate = useNavigate();
  const [phoneSidebar, setPhoneSidebar] = useState(false);

  const hideSidebar = () => {
    setPhoneSidebar(false);
  };

  const handleDashboard = () => {
    setPhoneSidebar(false);
    navigate("/admin/dashboard");
  };

  const handleOrders = () => {
    setPhoneSidebar(false);
    navigate("/admin/orders");
  };

  const handleUsers = () => {
    setPhoneSidebar(false);
    navigate("/admin/users");
  };

  const handleAll = () => {
    setPhoneSidebar(false);
    navigate("/admin/products");
  };

  const handleCreate = () => {
    setPhoneSidebar(false);
    navigate("/admin/newproduct");
  };

  return (
    <>
      <div
        className={
          phoneSidebar ? "sidebar_container phoneSidebar" : "sidebar_container"
        }
      >
        <div className="sidebar_close" onClick={hideSidebar}>
          <CloseIcon />
        </div>
        <div onClick={handleDashboard}>
          <p>
            <DashboardIcon /> Dashboard
          </p>
        </div>
        <div>
          <SimpleTreeView>
            <TreeItem itemId="grid" label="Products">
              <TreeItem
                itemId="1"
                label="All"
                icon={<PostAddIcon />}
                onClick={handleAll}
              />

              <TreeItem
                itemId="2"
                label="Create"
                icon={<AddIcon />}
                onClick={handleCreate}
              />
            </TreeItem>
          </SimpleTreeView>
        </div>

        <div onClick={handleOrders}>
          <p>
            <ListAltIcon />
            Orders
          </p>
        </div>
        <div onClick={handleUsers}>
          <p>
            <PeopleIcon /> Users
          </p>
        </div>
      </div>

      <div className="content_container">
        <div className="menu" onClick={() => setPhoneSidebar(true)}>
          <MenuIcon />
        </div>
        {content}
      </div>
    </>
  );
};

export default Sidebar;
