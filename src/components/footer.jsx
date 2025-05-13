import React from "react";

const Footer = () => {
  return (
    <>
      <div className="container my-5">

            <footer className="text-center text-white" style={{ backgroundColor: "#f1f1f1" }}>
            {/* <!-- Grid container --> */}
            <div className="container pt-4">
              {/* <!-- Section: Social media --> */}
              <section className="mb-4">
                {/* <!-- Facebook --> */}
                <a
                  className="btn btn-link btn-floating btn-lg text-dark m-1"
                  href="#!"
                  role="button"
                  data-mdb-ripple-color="dark"
                  ><i className="fab fa-facebook-f"></i
                ></a>

                {/* <!-- Twitter --> */}
                <a
                  className="btn btn-link btn-floating btn-lg text-dark m-1"
                  href="#!"
                  role="button"
                  data-mdb-ripple-color="dark"
                  ><i className="fab fa-twitter"></i
                ></a>

                {/* <!-- Google --> */}
                <a
                  className="btn btn-link btn-floating btn-lg text-dark m-1"
                  href="#!"
                  role="button"
                  data-mdb-ripple-color="dark"
                  ><i className="fab fa-google"></i
                ></a>

                {/* <!-- Instagram --> */}
                <a
                  className="btn btn-link btn-floating btn-lg text-dark m-1"
                  href="#!"
                  role="button"
                  data-mdb-ripple-color="dark"
                  ><i className="fab fa-instagram"></i
                ></a>

                {/* <!-- Linkedin --> */}
                <a
                  className="btn btn-link btn-floating btn-lg text-dark m-1"
                  href="#!"
                  role="button"
                  data-mdb-ripple-color="dark"
                  ><i className="fab fa-linkedin"></i
                ></a>
                {/* <!-- Github --> */}
                <a
                  className="btn btn-link btn-floating btn-lg text-dark m-1"
                  href="#!"
                  role="button"
                  data-mdb-ripple-color="dark"
                  ><i className="fab fa-github"></i
                ></a>
              </section>
              {/* <!-- Section: Social media --> */}
            </div>
            {/* <!-- Grid container --> */}

            {/* <!-- Copyright --> */}
            <div className="text-center text-dark p-3" style={{ backgroundColor: "rgba(0, 0, 0, 0.2)" }}>
              © 2025 Copyright:
              <a className="text-dark" href="https://mdbootstrap.com/">MDBootstrap.com</a>
            </div>
            {/* <!-- Copyright --> */}
            </footer>

      </div>
    </>
  );
};

export default Footer;
