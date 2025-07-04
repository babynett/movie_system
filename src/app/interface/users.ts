export interface Movies {
  id: number;
  title: string;
  description: string;
  ratings: boolean;
}
//Movies is the type array
const movies: Movies[] = [
  {
    id: 1,
    title: "Harry Potter",
    description: "A magical journey of a young wizard",
    ratings: true,
  },
  {
    id: 2,
    title: "The Lord of the Rings",
    description: "Epic fantasy adventure",
    ratings: true,
  },
  {
    id: 3,
    title: "Inception",
    description: "A mind-bending thriller through dreams",
    ratings: true,
  },
  {
    id: 4,
    title: "The Matrix",
    description: "A hacker uncovers the truth about reality",
    ratings: true,
  },
  {
    id: 5,
    title: "Interstellar",
    description: "Space travel to save humanity",
    ratings: true,
  },
  {
    id: 6,
    title: "Titanic",
    description: "A love story on the doomed ocean liner",
    ratings: true,
  },
  {
    id: 7,
    title: "Avengers: Endgame",
    description: "Heroes unite for one final battle",
    ratings: true,
  },
  {
    id: 8,
    title: "Forrest Gump",
    description: "A man’s incredible journey through life",
    ratings: true,
  },
  {
    id: 9,
    title: "The Dark Knight",
    description: "Batman faces his greatest threat yet",
    ratings: true,
  },
  {
    id: 10,
    title: "Spirited Away",
    description: "A girl enters a world of spirits and gods",
    ratings: true,
  },
  {
    id: 11,
    title: "Interstellar",
    description: "A team travels through a wormhole to save humanity",
    ratings: true,
  },
  {
    id: 12,
    title: "Coco",
    description:
      "A boy explores the Land of the Dead to uncover his family's secrets",
    ratings: false,
  },
];

export default movies;
