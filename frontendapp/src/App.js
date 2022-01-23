import React, { useState, useEffect } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";

function App() {
  const [name, setName] = useState("");
  const [price, setPrice] = useState(0.0);
  const [qty, setQty] = useState(0);

  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [items, setItems] = useState([]);
  const [searchqry, setSearchQry] = useState("");

  function getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie !== "") {
      var cookies = document.cookie.split(";");
      for (var i = 0; i < cookies.length; i++) {
        var cookie = cookies[i].trim();
        if (cookie.substring(0, name.length + 1) === name + "=") {
          cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
          break;
        }
      }
    }

    return cookieValue;
  }

  const updateproductable = (event) => {
    fetch(`http://127.0.0.1:8000/product/?limit=1000&name__contains=${searchqry}`)
      .then((res) => res.json())
      .then(
        (data) => {
          setIsLoaded(true);
          setItems(data.results);
        },
        (error) => {
          setIsLoaded(true);
          setError(error);
        }
      );
  };
  const handleformsubmit = (event) => {
    event.preventDefault();

    var csrftoken = getCookie("csrftoken");

    fetch("http://127.0.0.1:8000/product/create/", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
        "X-CSRFToken": csrftoken,
      },
      body: JSON.stringify({ name: name, price: price, quantity: qty }),
    })
      .then((response) => {
        updateproductable();
        handleClose();
      })
      .catch(function (error) {
        console.log("ERROR:", error);
      });
  };

  const [inEditMode, setInEditMode] = useState({
    status: false,
    rowKey: null,
  });

  const onEdit = ({ id, myname, myprice, myquantity }) => {
    setInEditMode({
      status: true,
      rowKey: id,
    });

    setName(myname);
    setPrice(myprice);
    setQty(myquantity);
  };

  const onEditSave = ({ id }) => {
    var csrftoken = getCookie("csrftoken");

    fetch(`http://127.0.0.1:8000/product/update/${id}`, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
        "X-CSRFToken": csrftoken,
      },
      body: JSON.stringify({ id: id, name: name, price: price, quantity: qty }),
    })
      .then((response) => {
        updateproductable();
        handleClose();
      })
      .catch(function (error) {
        console.log("ERROR:", error);
      });

    setInEditMode({
      status: false,
      rowKey: null,
    });

    updateproductable();
  };

  const onEditCancel = () => {
    setInEditMode({
      status: false,
      rowKey: null,
    });
  };

  const handleSearch = () => {
    updateproductable();
  };

  useEffect(() => {
    fetch(`http://127.0.0.1:8000/product/?limit=1000`)
      .then((res) => res.json())
      .then(
        (data) => {
          setIsLoaded(true);
          setItems(data.results);
        },
        (error) => {
          setIsLoaded(true);
          setError(error);
        }
      );
  }, []);

  let cnt = 0;
  if (error) {
    return <div>Error: {error.message}</div>;
  } else if (!isLoaded) {
    return <div>Loading...</div>;
  } else {
    return (
      <Container className="mt-5">
        <Row>
          <Card className="p-0">
            <Card.Header>
              <Row>
                <Col>
                  <h4>Products</h4>
                </Col>
                <Col>
                  <Row>
                    <Col md={8}>
                      <InputGroup>
                        <Form.Control
                          placeholder="search here..."
                          onChange={(e) => setSearchQry(e.target.value)}
                        />
                        <Button variant="primary" onClick={handleSearch}>
                          Search
                        </Button>
                      </InputGroup>
                    </Col>
                    <Col md={4} className="d-flex justify-content-end">
                      <Button variant="primary" onClick={handleShow}>
                        Add New
                      </Button>
                    </Col>
                  </Row>
                </Col>
              </Row>
            </Card.Header>
            <Card.Body>
              <Form>
                <Table striped bordered hover size="sm">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Product Name</th>
                      <th>Price</th>
                      <th>Quantity</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((item) => (
                      <tr key={item.id}>
                        <th scope="row">{(cnt = cnt + 1)}</th>
                        <td>
                          {inEditMode.status &&
                          inEditMode.rowKey === item.id ? (
                            <Form.Control
                              name="name"
                              type="text"
                              defaultValue={item.name}
                              onChange={(e) => setName(e.target.value)}
                            />
                          ) : (
                            <>{item.name}</>
                          )}
                        </td>
                        <td>
                          {inEditMode.status &&
                          inEditMode.rowKey === item.id ? (
                            <Form.Control
                              name="price"
                              type="text"
                              defaultValue={item.price}
                              onChange={(e) => setPrice(e.target.value)}
                            />
                          ) : (
                            <>{item.price}</>
                          )}
                        </td>
                        <td>
                          {inEditMode.status &&
                          inEditMode.rowKey === item.id ? (
                            <Form.Control
                              name="quantity"
                              type="text"
                              defaultValue={item.quantity}
                              onChange={(e) => setQty(e.target.value)}
                            />
                          ) : (
                            <>{item.quantity}</>
                          )}
                        </td>
                        <td>
                          {inEditMode.status &&
                          inEditMode.rowKey === item.id ? (
                            <>
                              <Button
                                variant="primary"
                                size="sm"
                                onClick={() => onEditSave({ id: item.id })}
                              >
                                Save
                              </Button>

                              <Button
                                variant="secondary"
                                style={{ marginLeft: 8 }}
                                onClick={() => onEditCancel()}
                                size="sm"
                              >
                                Cancel
                              </Button>
                            </>
                          ) : (
                            <Button
                              variant="primary"
                              onClick={() =>
                                onEdit({
                                  id: item.id,
                                  myname: item.name,
                                  myprice: item.price,
                                  myquantity: item.quantity,
                                })
                              }
                              size="sm"
                            >
                              Edit
                            </Button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Form>
            </Card.Body>
          </Card>
          <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
              <Modal.Title>Add New Product</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form onSubmit={handleformsubmit} id="addnewprod">
                <Form.Group as={Row} className="mb-3">
                  <Form.Label column sm="2">
                    Name
                  </Form.Label>
                  <Col sm="10">
                    <Form.Control
                      name="name"
                      type="text"
                      placeholder="enter name"
                      onChange={(e) => setName(e.target.value)}
                    />
                  </Col>
                </Form.Group>

                <Form.Group as={Row} className="mb-3">
                  <Form.Label column sm="2">
                    Price
                  </Form.Label>
                  <Col sm="10">
                    <Form.Control
                      name="price"
                      type="text"
                      placeholder="enter price"
                      onChange={(e) => setPrice(e.target.value)}
                    />
                  </Col>
                </Form.Group>
                <Form.Group as={Row} className="mb-3">
                  <Form.Label column sm="2">
                    Quantity
                  </Form.Label>
                  <Col sm="10">
                    <Form.Control
                      name="qty"
                      type="text"
                      placeholder="enter Quantity"
                      onChange={(e) => setQty(e.target.value)}
                    />
                  </Col>
                </Form.Group>
              </Form>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleClose}>
                Close
              </Button>
              <Button variant="primary" type="submit" form="addnewprod">
                Save
              </Button>
            </Modal.Footer>
          </Modal>
        </Row>
      </Container>
    );
  }
}

export default App;
