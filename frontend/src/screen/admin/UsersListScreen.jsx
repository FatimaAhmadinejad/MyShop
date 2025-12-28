import { Table, Button } from 'react-bootstrap'
import { FaTimes, FaTrash, FaCheck } from 'react-icons/fa'
import Message from '../../compontent/Message.jsx'
import Loader from '../../compontent/Loader.jsx'
import { useSelector } from 'react-redux'
import { useGetUsersQuery, useDeleteUserMutation } from '../../slices/userApiSlice.js'
import { toast } from 'react-toastify'

const UserListScreen = () => {
  const { userInfo } = useSelector((state) => state.auth)

  // اگر userInfo یا admin نیست، query اجرا نشود
  const skipQuery = !userInfo?.token || !userInfo?.isAdmin

  const { data: users = [], refetch, isLoading, error } = useGetUsersQuery(
    userInfo?.token,
    { skip: skipQuery }
  )

  const [deleteUser] = useDeleteUserMutation()

  // اگر user login نیست یا admin نیست پیام بده
  if (!userInfo || !userInfo.isAdmin) {
    return <Message variant="danger">You must be an admin to view this page</Message>
  }

  const deleteHandler = async (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await deleteUser(id).unwrap()
        refetch()
        toast.success('User deleted successfully')
      } catch (err) {
        toast.error(err?.data?.message || err?.error || 'Something went wrong')
      }
    }
  }

  return (
    <>
      <h1>Users</h1>
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant='danger'>
          {error?.data?.message || error?.error || JSON.stringify(error)}
        </Message>
      ) : (
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
            {users.map((user) => (
              <tr key={user._id}>
                <td>{user._id}</td>
                <td>{user.name}</td>
                <td>
                  <a href={`mailto:${user.email}`}>{user.email}</a>
                </td>
                <td>
                  {user.isAdmin ? (
                    <FaCheck style={{ color: 'green' }} />
                  ) : (
                    <FaTimes style={{ color: 'red' }} />
                  )}
                </td>
                <td>
                  <Button
                    variant='danger'
                    className='btn-sm'
                    onClick={() => deleteHandler(user._id)}
                  >
                    <FaTrash style={{ color: 'white' }} />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </>
  )
}

export default UserListScreen




