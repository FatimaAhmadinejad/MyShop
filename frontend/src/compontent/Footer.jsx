import {Container,Row,Col} from 'react-bootstrap';  
const Footer = () => {
 const currentYear = new Date().getFullYear()
 
    return (
    <footer>
        <Container>
          <Row>
             <Col className='text-center py-3'>
              <p>MyShop &copy; {new Date().getFullYear()}</p>
             </Col>
            </Row>
        </Container>

    </footer>
  )
}

export default Footer