import React from 'react'
import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import HeroImg from '../../assets/images/hero-clean.jpg'

const Hero = () => {
  return (
    <section className='section-1'>
        <div className='container'>
            <div className="row align-items-center justify-content-between min-vh-75 py-5">
                <div className="col-lg-6 mb-5 mb-lg-0 text-center text-lg-start pe-lg-5">
                    <div className="badge bg-light text-muted border mb-4 px-3 py-2 rounded-pill d-inline-flex align-items-center">
                        <span className="fw-semibold">The New Standard in Learning</span>
                    </div>
                    <h1 className="display-3 fw-bolder mb-4" style={{ letterSpacing: '-0.05em' }}>
                        Elevate your <br/>
                        <span className="text-primary">knowledge.</span>
                    </h1>
                    <p className="lead mb-5 text-muted" style={{ maxWidth: '480px' }}>
                        Access premium educational content designed for modern professionals. Learn at your own pace with our advanced platform.
                    </p>
                    <div className="d-flex flex-column flex-sm-row gap-3 justify-content-center justify-content-lg-start">
                        <Link to="/courses" className="btn btn-primary btn-lg fw-bold px-5 py-3 d-inline-flex align-items-center justify-content-center gap-2">
                            Start Learning <ArrowRight size={18} />
                        </Link>
                    </div>
                </div>
                <div className="col-lg-6 text-center position-relative">
                    <div className="position-absolute bg-light rounded-circle" style={{ width: '80%', height: '80%', top: '10%', left: '10%', zIndex: 0 }}></div>
                    <img src={HeroImg} alt="Student Learning" className="img-fluid position-relative z-1 shadow-lg rounded-4 border"/>
                </div>
            </div>            
        </div>
    </section>
  )
}

export default Hero