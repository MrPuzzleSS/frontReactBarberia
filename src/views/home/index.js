import React from 'react';
import {
  CCarousel,
  CCarouselItem,
  CCarouselCaption,
  CImage
} from '@coreui/react';

import img1 from 'src/assets/images/Barberia1.jpg';
import img2 from 'src/assets/images/barberia2.jpg';
import img3 from 'src/assets/images/barberia3.jpeg';

import 'src/assets/css/stylecarrousel.css'

function HomeCliente() {
  return (
    <CCarousel controls className='custom-carousel'>
  <CCarouselItem>  
    <CImage  src={img1} alt="slide 1" className='carousel-image'/>
    <CCarouselCaption className="d-none d-md-block custom-caption">
      <h2>EL MEJOR CORTE</h2>
      <p>Estilo impecable, precisión incomparable. En nuestra barbería, cada corte es una obra maestra.</p>
    </CCarouselCaption>
  </CCarouselItem>
  <CCarouselItem>
    <CImage src={img2} alt="slide 2" className='carousel-image'/>
    <CCarouselCaption className="d-none d-md-block custom-caption">
      <h2>EL MEJOR PRECIO</h2>
      <p>Calidad que no pesa en tu bolsillo. En nuestra barbería, la excelencia no tiene precio, ¡excepto el justo!</p>
    </CCarouselCaption>
  </CCarouselItem>
  <CCarouselItem>
    <CImage src={img3} alt="slide 3" className='carousel-image'/>
    <CCarouselCaption className="d-none d-md-block custom-caption">
      <h2>LA MEJOR CALIDAD</h2>
      <p>No comprometemos la excelencia. En nuestra barbería, la calidad es más que un estándar, ¡es un compromiso con tu estilo!</p>
    </CCarouselCaption>
  </CCarouselItem>
</CCarousel>
  )
}

export default HomeCliente