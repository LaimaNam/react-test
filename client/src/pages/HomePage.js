import axios from 'axios';
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

const Teams = styled.section`
  padding: 20px;
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 40px;

  div {
    width: 100%;
    text-align: center;
    box-shadow: 0px 0px 10px -3px #000000;
    margin-bottom: 20px;
  }

  h4 {
    margin: 0;
    margin-top: 5px;
  }

  p {
    margin-bottom: 15px;
  }

  div img {
    width: 100%;
    height: 200px;
    object-fit: cover;
  }

  @media (min-width: 508px) {
    div {
      width: calc(100% / 2 - 10px);
      text-align: center;
      box-shadow: 0px 0px 10px -3px #000000;
      margin-bottom: 20px;
    }
  }

  @media (min-width: 768px) {
    div {
      width: calc(100% / 3 - 10px);
      text-align: center;
      box-shadow: 0px 0px 10px -3px #000000;
      margin-bottom: 20px;
    }
  }

  @media (min-width: 1000px) {
    div {
      width: calc(100% / 4 - 10px);
      text-align: center;
      box-shadow: 0px 0px 10px -3px #000000;
      margin-bottom: 20px;
    }
  }
`;

// -- API URL
const GET_TEAMS_URI = 'http://localhost:5000/api/teams';
// const GET_TEAMS_URI = 'https://ca-react-test.herokuapp.com/api/teams';

const getTeams = async (setAllTeams) => {
  try {
    const teams = await axios.get(GET_TEAMS_URI);

    setAllTeams(teams.data);
  } catch (err) {
    return console.log(err);
  }
};

const HomePage = () => {
  const [allTeams, setAllTeams] = useState([]);

  useEffect(() => {
    getTeams(setAllTeams);
  }, []);

  return (
    <main>
      <Teams>
        {allTeams && allTeams.length !== 0 ? (
          allTeams.map((team) => (
            <div key={team._id}>
              <img src={team.image} alt="" />
              <h4>{`${team.title} team`}</h4>
              <p>Score: {team.votes}</p>
            </div>
          ))
        ) : (
          <p>No teams to show</p>
        )}
      </Teams>
    </main>
  );
};

export default HomePage;

// import React, { useContext } from 'react';
// import { TeamContext } from './../App';
// import styled from 'styled-components';

// const Teams = styled.section`
//   padding: 20px;
//   display: flex;
//   flex-wrap: wrap;
//   gap: 10px;
//   margin-top: 40px;

//   div {
//     width: 100%;
//     text-align: center;
//     box-shadow: 0px 0px 10px -3px #000000;
//     margin-bottom: 20px;
//   }

//   h4 {
//     margin: 0;
//     margin-top: 5px;
//   }

//   p {
//     margin-bottom: 15px;
//   }

//   div img {
//     width: 100%;
//     height: 200px;
//     object-fit: cover;
//   }

//   @media (min-width: 508px) {
//     div {
//       width: calc(100% / 2 - 10px);
//       text-align: center;
//       box-shadow: 0px 0px 10px -3px #000000;
//       margin-bottom: 20px;
//     }
//   }

//   @media (min-width: 768px) {
//     div {
//       width: calc(100% / 3 - 10px);
//       text-align: center;
//       box-shadow: 0px 0px 10px -3px #000000;
//       margin-bottom: 20px;
//     }
//   }

//   @media (min-width: 1000px) {
//     div {
//       width: calc(100% / 4 - 10px);
//       text-align: center;
//       box-shadow: 0px 0px 10px -3px #000000;
//       margin-bottom: 20px;
//     }
//   }
// `;

// const HomePage = () => {
//   const { state } = useContext(TeamContext);

//   return (
//     <main>
//       <Teams>
//         {state.allTeams && state.allTeams.length !== 0 ? (
//           state.allTeams.map((team) => (
//             <div key={team._id}>
//               <img src={team.image} alt="" />
//               <h4>{`${team.title} team`}</h4>
//               <p>Score: {team.votes}</p>
//             </div>
//           ))
//         ) : (
//           <p>No teams to show</p>
//         )}
//       </Teams>
//     </main>
//   );
// };

// export default HomePage;
