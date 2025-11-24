function Footer() {
  return (
    <footer>
      <div className="top">
        <ul>
            <li><a href="/about">About Us</a></li>
            <li><a href="/">Shop</a></li>
            <li><a href="/contact">Locate Us</a></li>
        </ul>
        <ul>
            <li><a href="/about">About Us</a></li>
            <li><a href="/">Shop</a></li>
            <li><a href="/contact">Locate Us</a></li>
        </ul>
        <ul>
            <li><a href="/about">About Us</a></li>
            <li><a href="/">Shop</a></li>
            <li><a href="/contact">Locate Us</a></li>
        </ul>
      </div>
      <div className="bottom">
        <p>&copy; {new Date().getFullYear()} All Rights Reserved</p>
      </div>
    </footer>
  );
}

export default Footer;
