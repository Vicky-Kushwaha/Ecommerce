import { useState, useEffect } from "react";
import "./ResetPassword.css";
import Loading from "../layouts/Loader/Loader";
import SumitLoader from "../layouts/SubmitLoader/SubmitLoader";
import { useDispatch, useSelector } from "react-redux";
import { clearErrors, resetPassword } from "../../actions/userAction";
import MetaData from "../layouts/MetaData";
import LockOpenOutlinedIcon from '@mui/icons-material/LockOpenOutlined';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import {useNavigate} from "react-router-dom";
import {useParams} from "react-router-dom";
import { toast } from 'react-toastify';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';

const ResetPassword = () => {

  const {token} = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { error, success, loading } = useSelector(
    (state) => state.forgotPassword
  );

  const [submitLoading, setSubmitLoading] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword,setShowPassword] = useState(false);
  const [showConfirmPassword,setShowConfirmPassword] = useState(false);

  const resetPasswordSubmit = (e) => {
    e.preventDefault();

    const myForm = new FormData();

    myForm.set("password", password);
    myForm.set("confirmPassword", confirmPassword);

    setSubmitLoading(true);
    dispatch(resetPassword(token, myForm));
  };

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearErrors());
      setSubmitLoading(false);
    }

    if (success) {
      toast.success("Password Updated Successfully");
      setSubmitLoading(false);
      navigate("/login");
    }
  }, [dispatch, error, success, navigate]);

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <> 
          <MetaData title="Change Password" />        
          <div className="resetPasswordContainer">
            <div className="resetPasswordBox">
              <h2 className="resetPasswordHeading">Update Profile</h2>

              <form
                className="resetPasswordForm"
                onSubmit={resetPasswordSubmit}
              >
                <div className="loginPassword">
                  <LockOpenOutlinedIcon />
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="New Password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  {password && <span className="showPassword"  onClick={()=> showPassword ? setShowPassword(false) : setShowPassword(true)} >{showPassword ? <VisibilityOffOutlinedIcon /> : <VisibilityOutlinedIcon />}</span>}
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
                  value="Update"
                  className="resetPasswordBtn"
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

export default ResetPassword;
