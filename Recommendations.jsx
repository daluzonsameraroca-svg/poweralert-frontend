import { useEffect, useState } from "react";
import Card from "../../components/common/Card";
import PageHeader from "../../components/common/PageHeader";
import { getRecommendations } from "../../api/billApi";

export default function Recommendations() {
  const user = JSON.parse(localStorage.getItem("user"));
  const [tips, setTips] = useState([]);

  useEffect(() => {
    loadRecommendations();
  }, []);

  async function loadRecommendations() {
    try {
      const res = await getRecommendations(user.user_id);
      setTips(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.log("Failed to load recommendations", error);
      setTips([]);
    }
  }

  return (
    <>
      <PageHeader
        title="Energy Saving Recommendations"
        subtitle="Personalized tips based on your latest electric bill."
      />

      {tips.length === 0 ? (
        <Card title="No Recommendations">
          <p>No recommendations available yet.</p>
        </Card>
      ) : (
        tips.map((tip, index) => (
          <Card key={index} title={tip.title}>
            <p>{tip.message}</p>
          </Card>
        ))
      )}
    </>
  );
}