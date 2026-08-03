/** Raw response shapes from dummyjson.com, kept separate from our domain types. */

export interface UserDto {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  image: string;
  company: {
    department: string;
    name: string;
    title: string;
  };
  address: {
    city: string;
  };
}

export interface UsersResponseDto {
  users: UserDto[];
  total: number;
  skip: number;
  limit: number;
}

export interface CommentDto {
  id: number;
  body: string;
  postId: number;
  likes: number;
  user: {
    id: number;
    username: string;
    fullName: string;
  };
}

export interface CommentsResponseDto {
  comments: CommentDto[];
  total: number;
  skip: number;
  limit: number;
}
