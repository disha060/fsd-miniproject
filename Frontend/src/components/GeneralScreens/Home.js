import axios from "axios";
import { v4 as uuidv4 } from 'uuid';
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import SkeletonStory from "../Skeletons/SkeletonStory";
import CardStory from "../StoryScreens/CardStory";
import NoStories from "../StoryScreens/NoStories";
import Pagination from "./Pagination";
import "../../Css/Home.css";

const Home = () => {
  const search = useLocation().search;
  const searchKey = new URLSearchParams(search).get('search');
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    const getStories = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get(
          `/story/getAllStories?search=${searchKey || ""}&page=${page}`
        );

        console.log("API Response:", data);

        // ✅ Safely navigate with updated query params
        if (searchKey) {
          navigate({
            pathname: '/',
            search: `?search=${searchKey}${page > 1 ? `&page=${page}` : ""}`,
          });
        } else {
          navigate({
            pathname: '/',
            search: `${page > 1 ? `page=${page}` : ""}`,
          });
        }

        // ✅ Prevent undefined by using fallback defaults
        setStories(data.data || []);
        setPages(data.pages || 1);
      } catch (error) {
        console.error("Error fetching stories:", error);
        setStories([]); // prevent undefined
      } finally {
        setLoading(false);
      }
    };

    getStories();
  }, [searchKey, page, navigate]);

  // ✅ Reset to first page when search changes
  useEffect(() => {
    setPage(1);
  }, [searchKey]);

  return (
    <div className="Inclusive-home-page">
      {loading ? (
        <div className="skeleton_emp">
          {[...Array(6)].map(() => (
            <SkeletonStory key={uuidv4()} />
          ))}
        </div>
      ) : (
        <div>
          <div className="story-card-wrapper">
            {stories && stories.length > 0 ? (
              stories.map((story) => (
                <CardStory key={uuidv4()} story={story} />
              ))
            ) : (
              <NoStories />
            )}
            <img className="bg-planet-svg" src="planet.svg" alt="planet" />
            <img className="bg-planet2-svg" src="planet2.svg" alt="planet2" />
            <img className="bg-planet3-svg" src="planet3.svg" alt="planet3" />
          </div>

          <Pagination page={page} pages={pages} changePage={setPage} />
        </div>
      )}
      <br />
    </div>
  );
};

export default Home;
