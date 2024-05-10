import "./Footer.css";
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import GitHubIcon from '@mui/icons-material/GitHub';
import MailOutlineIcon from '@mui/icons-material/MailOutline';

const Footer = () => {
  return (
    <footer id="footer">
      <div className="midFooter">
        <h1>ECOMMERCE.</h1>
        <p>High Quality is our first priority</p>

        <p>Copyrights 2024 &copy; Vicky Kushwaha</p>
      </div>

      <div className="rightFooter">
      <a href="https://www.linkedin.com/in/vicky-kushwaha-352a212ab/" rel="noopener noreferrer" target="_blank" ><LinkedInIcon/></a>  
        <a href="https://github.com/Vicky-Kushwaha?tab=repositories" target="_blank" rel="noopener noreferrer"><GitHubIcon/></a>
        <a href="mailto:muzvickykerma@gmail.com" target="_blank" rel="noopener noreferrer" ><MailOutlineIcon/></a>
      </div>
    </footer>
  );
};

export default Footer;
