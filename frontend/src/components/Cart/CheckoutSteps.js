import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import LibraryAddCheckOutlinedIcon from '@mui/icons-material/LibraryAddCheckOutlined';
import AccountBalanceWalletOutlinedIcon from '@mui/icons-material/AccountBalanceWalletOutlined';
import "./CheckoutStep.css";

const CheckoutSteps = ({ activeStep }) => {
  const steps = [
    {
      label:  "Shipping Details" ,
      icon: <LocalShippingOutlinedIcon />,
    },
    {
      label:  "Confirm Order" ,
      icon: <LibraryAddCheckOutlinedIcon />,
    },
    {
      label:  "Payment" ,
      icon: <AccountBalanceWalletOutlinedIcon />,
    },
  ];

  const stepStyles = {
    boxSizing: "border-box",
  };

  return (
    <>
      <Stepper alternativeLabel activeStep={activeStep} style={stepStyles}>
        {steps.map((item, index) => (
          <Step
            key={index}
            active={activeStep === index ? true : false}
            completed={activeStep >= index ? true : false}
          >
            <StepLabel
              style={{
                color: activeStep >= index ? "tomato" : "rgba(0, 0, 0, 0.649)",
              }}
              icon={item.icon}
            >
              {item.label}
            </StepLabel>
          </Step>
        ))}
      </Stepper>
    </>
  );
};

export default CheckoutSteps;
