import {useState} from 'react'
import {Form,Button} from 'react-bootstrap'
import {useParams,useNavigate} from 'react-router-dom'

const SearchBox = () => {
    const navigate = useNavigate();
    const { keyword: urlKeyword } = useParams();
    const [keyword,SetKeyword] = useState(urlKeyword || '');
    const submitHandler = (e) => {
        e.preventDefault();
        if(keyword.trim()){
            SetKeyword('');
            navigate(`/search/${keyword}`)
        } else {
            navigate('/')
        }
    }
  return (
    <Form onSubmit={submitHandler} className='d-flex'>
        <Form.Control
        type='text'
        name='q'
        onChange={(e) => SetKeyword(e.target.value)}
        value={keyword}
        placeholder='Search Products...'
        className='mr-sm-2 ml-sm-5'
        ></Form.Control>
        <Button type='submit' variant='outline-success' className='p-2 mx-2'>
            Search
        </Button>
    </Form>
  )
}

export default SearchBox