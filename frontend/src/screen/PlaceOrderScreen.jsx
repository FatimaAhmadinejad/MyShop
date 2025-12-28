import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Button, Row, Col, ListGroup, Image } from "react-bootstrap";
import CheckOutSteps from "../compontent/CheckoutSteps";
import { toast } from "react-toastify";
import Message from "../compontent/Message.jsx";
import Loader from "../compontent/Loader.jsx";
import { clearCartItems } from "../slices/cartSlice.js";
import { useCreateOrderMutation } from "../slices/orderApiSlice.js";

const PlaceOrderScreen = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Cart state
  const cart = useSelector((state) => state.cart);

  // User state
  const userInfo = useSelector((state) => state.auth?.userInfo);

  const [createOrder, { isLoading, error }] = useCreateOrderMutation();

  const PlaceOrderHandler = async () => {
    if (!userInfo) {
      toast.error("You must be logged in");
      navigate("/login");
      return;
    }

    try {
      // Payload دقیق مطابق بک‌اند
      const orderPayload = {
        orderItems: cart.cartItems,
        shippingAddress: cart.shippingAddress,
        paymentMethod: cart.paymentMethod,
        itemsPrice: cart.itemsPrice,
        shippingPrice: cart.shippingPrice,
        taxPrice: cart.taxPrice,
        totalPrice: cart.totalPrice,
      };

      console.log("Sending order payload:", orderPayload);

      // ارسال مستقیم payload
      const res = await createOrder(orderPayload).unwrap();

      console.log("createOrder response:", res);

      if (res && res._id) {
        dispatch(clearCartItems());
        navigate(`/order/${res._id}`);
      } else {
        console.error("No _id in createOrder response", res);
        toast.error("Invalid response from server");
      }
    } catch (err) {
      console.error("createOrder error:", err);
      toast.error(err?.data?.message || err.error || "Something went wrong");
    }
  };

  useEffect(() => {
    if (!cart.shippingAddress?.address) {
      navigate("/shipping");
    } else if (!cart.paymentMethod) {
      navigate("/payment");
    }
  }, [cart.paymentMethod, cart.shippingAddress, navigate]);

  return (
    <>
      <CheckOutSteps step1 step2 step3 step4 />
      <Row>
        <Col md={8}>
          <ListGroup variant="flush">
            <ListGroup.Item>
              <h2>Shipping</h2>
              <p>
                <strong>Address:</strong> {cart.shippingAddress.address},{" "}
                {cart.shippingAddress.city} {cart.shippingAddress.postalCode},{" "}
                {cart.shippingAddress.country}
              </p>
            </ListGroup.Item>

            <ListGroup.Item>
              <h2>Payment Method:</h2>
              <strong>Method:</strong> {cart.paymentMethod}
            </ListGroup.Item>

            <ListGroup.Item>
              <h2>Order items</h2>
              {cart.cartItems.length === 0 ? (
                <Message>Your Cart is empty</Message>
              ) : (
                <ListGroup variant="flush">
                  {cart.cartItems.map((item, index) => (
                    <ListGroup.Item key={index}>
                      <Row>
                        <Col md={2}>
                          <Image src={item.image} alt={item.name} fluid rounded />
                        </Col>
                        <Col>
                          <Link to={`/product/${item._id}`}>{item.name}</Link>
                        </Col>
                        <Col md={4}>
                          {item.qty} x ${item.price} = ${item.qty * item.price}
                        </Col>
                      </Row>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              )}
            </ListGroup.Item>
          </ListGroup>
        </Col>

        <Col md={4}>
          <ListGroup variant="flush">
            <ListGroup.Item>
              <h2>Order Summary</h2>
            </ListGroup.Item>

            <ListGroup.Item>
              <Row>
                <Col>Items:</Col>
                <Col>${cart.itemsPrice}</Col>
              </Row>
            </ListGroup.Item>

            <ListGroup.Item>
              <Row>
                <Col>Shipping:</Col>
                <Col>${cart.shippingPrice}</Col>
              </Row>
            </ListGroup.Item>

            <ListGroup.Item>
              <Row>
                <Col>Tax:</Col>
                <Col>${cart.taxPrice}</Col>
              </Row>
            </ListGroup.Item>

            <ListGroup.Item>
              <Row>
                <Col>Total:</Col>
                <Col>${cart.totalPrice}</Col>
              </Row>
            </ListGroup.Item>

            {error && (
              <ListGroup.Item>
                <Message variant="danger">
                  {error?.data?.message || error?.error || "Something went wrong"}
                </Message>
              </ListGroup.Item>
            )}

            <ListGroup.Item>
              <Button
                type="button"
                className="btn-block"
                disabled={cart.cartItems.length === 0}
                onClick={PlaceOrderHandler}
              >
                Place Order
              </Button>
              {isLoading && <Loader />}
            </ListGroup.Item>
          </ListGroup>
        </Col>
      </Row>
    </>
  );
};

export default PlaceOrderScreen;









