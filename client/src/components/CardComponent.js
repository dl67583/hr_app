import React from "react";
import { Card, CardContent, Typography } from "@mui/material";

const CardComponent = ({ icon, title, value, list }) => {
  const safeList = Array.isArray(list) ? list : [];

  return (
    <Card
      sx={{
        minWidth: 250,
        maxWidth: 350,
        margin: "16px",
        textAlign: "center",
        border: "1px solid #c5c6c7",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "16px",
      }}
    >
      <CardContent>
        <div
          style={{
            fontSize: "2rem",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            marginBottom: "8px",
          }}
        >
          {icon}
        </div>
        <Typography variant="h6">{title}</Typography>
        {value !== undefined ? (
          <Typography variant="h4" color="primary">
            {value}
          </Typography>
        ) : (
          <ul style={{ listStyle: "none", padding: 0 }}>
            {safeList.length > 0 ? (
              safeList.map((user) => (
                <Typography key={user.id} variant="body2">
                  {user.name} {user.surname}
                </Typography>
              ))
            ) : (
              <Typography variant="body2" color="text.secondary">
                None
              </Typography>
            )}
          </ul>
        )}
      </CardContent>
    </Card>
  );
};

export default CardComponent;
