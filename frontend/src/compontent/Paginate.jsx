import { Pagination } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

const Paginate = ({
  pages,
  page = 1,
  isAdmin = false,
  keyword = '',
  category = '',
  brand = '',
  minPrice = '',
  maxPrice = '',
  sort = '',
  isFilterScreen = false,
  isCategoryScreen = false,
}) => {
  if (pages <= 1) return null;

  return (
    <Pagination>
      {[...Array(pages).keys()].map((x) => {
        const pageNum = x + 1;
        let to = '';

        if (isAdmin) {
          to = `/admin/productlist/${pageNum}`;
        } else if (isFilterScreen) {
          to = {
            pathname: '/products/filter',
            search: `?page=${pageNum}&keyword=${keyword}&category=${category}&brand=${brand}&minPrice=${minPrice}&maxPrice=${maxPrice}&sort=${sort}`,
          };
        } else if (isCategoryScreen) {
          to = {
            pathname: `/category/${category}`,
            search: `?page=${pageNum}`,
          };
        } else if (keyword) {
          to = `/search/${keyword}/page/${pageNum}`;
        } else {
          to = `/page/${pageNum}`;
        }

        return (
          <LinkContainer key={pageNum} to={to}>
            <Pagination.Item active={pageNum === Number(page)}>{pageNum}</Pagination.Item>
          </LinkContainer>
        );
      })}
    </Pagination>
  );
};

export default Paginate;



