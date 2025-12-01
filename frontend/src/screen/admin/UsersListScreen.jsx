import {LinkContainer} from 'react-router-bootstrap'
import {Table,Button} from 'react-bootstrap'
import {FaTimes,FaTrash,FaEdit,FaCheck} from 'react-icons/fa';
import Message from '../../compontent/Message.jsx';
import Loader from '../../compontent/Loader.jsx';
import { useGetUsersQuery,useDeleteUserMutation } from '../../slices/userApiSlice.js';
import { toast }  from 'react-toastify'

const UserListScreen = () => {
  const {data: users,refetch,isLoading,error} = useGetUsersQuery();

  const [deleteUser] = useDeleteUserMutation();

  const deleteHandler = async (id) => {
    console.log(id)
    if (window.confirm('Are you sure')) {
      try {
        await deleteUser(id);
        refetch();
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };

  return <>
  <h1>Users</h1>
  {isLoading ? <Loader/> : error ? <Message variant='danger'>{error}</Message> : (
    <Table striped bordered hover responsive className='table-sm'>
      <thead>
        <tr>
        <th>ID</th>
        <th>NAME</th>
        <th>EMAIL</th>
        <th>ADMIN</th>
        <th></th>
        </tr>
      </thead>
      <tbody>
        {users.map((users) => (
          <tr key={users._id}>
            <td>{users._id}</td>
            <td>{users.name}</td>
            <td><a href={`mail to:${users.email}`}>{users.email}</a></td>
            <td>
              {users.isAdmin ? (
                <FaCheck style={{ color: 'green' }}/>
              ) : (
                <FaTimes style={{color:'red'}}/>
              )}
            </td>
            <td>
              <Button
              variant='danger'
              className='btn-sm'
              onClick={() => deleteHandler(users._id)}>
                <FaTrash style={{ color: 'white' }}/>
              </Button>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  )}
  </>
}

export default UserListScreen;