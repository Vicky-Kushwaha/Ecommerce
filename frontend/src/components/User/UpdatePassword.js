import {useState, useEffect } from "react";
import "./UpdatePassword.css";
import Loading from "../layouts/Loader/Loader";
import SumitLoader from "../layouts/SubmitLoader/SubmitLoader";
import { useDispatch, useSelector } from "react-redux";
import { clearErrors, updatePassword } from "../../actions/userAction";
import { UPDATE_PASSWORD_RESET } from "../../constants/userConstants";
import LockOpenOutlinedIcon from '@mui/icons-material/LockOpenOutlined';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import VpnKeyOutlinedIcon from '@mui/icons-material/VpnKeyOutlined';
import {useNavigate} from "react-router-dom";
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import MetaData from "../layouts/MetaData";
import {toast} from "react-toastify";


const UpdatePassword = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { error, isUpdated, loading } = useSelector((state) => state.profile);

  const [submitLoading, setSubmitLoading] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showOldPassword,setShowOldPassword] = useState(false);
  const [showNewPassword,setShowNewPassword] = useState(false);
  const [showConfirmPassword,setShowConfirmPassword] = useState(false);

  const updatePasswordSubmit = (e) => {
    e.preventDefault();

    const myForm = new FormData();

    myForm.set("oldPassword", oldPassword);
    myForm.set("newPassword", newPassword);
    myForm.set("confirmPassword", confirmPassword);

    dispatch(updatePassword(myForm));
    setSubmitLoading(true);
  };

  useEffect(() => {
    if (error) {
      dispatch(clearErrors());
      setSubmitLoading(false);
      toast.error(error);
    }

    if (isUpdated) {

      setSubmitLoading(false);
      navigate("/account");

      dispatch({
        type: UPDATE_PASSWORD_RESET,
      });
    }
  }, [dispatch, error, isUpdated, navigate]);

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <>
          <MetaData title="Change Password" />
          <div className="updatePasswordContainer">
            <div className="updatePasswordBox">
              <h2 className="updatePasswordHeading">Update Profile</h2>

              <form
                className="updatePasswordForm"
                onSubmit={updatePasswordSubmit}
              >
                <div className="loginPassword">
                  <VpnKeyOutlinedIcon />
                  <input
                    type={showOldPassword ? "text" : "password"}
                    placeholder="Old Password"
                    required
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                  />
                  {oldPassword && <span className="showPassword"  onClick={()=> showOldPassword ? setShowOldPassword(false) : setShowOldPassword(true)} >{showOldPassword ? <VisibilityOffOutlinedIcon /> : <VisibilityOutlinedIcon />}</span>}                  
                </div>

                <div className="loginPassword">
                  <LockOpenOutlinedIcon />
                  <input
                    type={showNewPassword ? "text" : "password"}
                    placeholder="New Password"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                  {newPassword && <span className="showPassword"  onClick={()=> showNewPassword ? setShowNewPassword(false) : setShowNewPassword(true)} >{showNewPassword ? <VisibilityOffOutlinedIcon /> : <VisibilityOutlinedIcon />}</span>}
                </div>
                <div className="loginPassword">
                  <LockOutlinedIcon />
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm Password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                  {confirmPassword && <span className="showPassword"  onClick={()=> showConfirmPassword ? setShowConfirmPassword(false) : setShowConfirmPassword(true)} >{showConfirmPassword ? <VisibilityOffOutlinedIcon /> : <VisibilityOutlinedIcon />}</span>}                  
                </div>
                <input
                  type="submit"
                  value="Change"
                  className="updatePasswordBtn"
                />
              </form>
            </div>
          </div>
          { submitLoading && <SumitLoader/>}          
        </>
      )}
    </>
  );
};

export default UpdatePassword;
