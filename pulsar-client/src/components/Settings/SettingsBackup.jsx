import { useRef } from "react";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";

import { settings } from "../../store";

const SettingsBackup = ({ disableAll }) => {
  const restore = useRef();
  const onSubmitBackup = () => {
    settings.backup();
  };

  const onSubmitRestore = (e) => {
    var fReader = new FileReader();
    fReader.readAsText(e.target.files[0]);
    fReader.onloadend = function (event) {
      settings.restore(event.target.result).then((data) => {
        console.log(data);
      });
    };
  };

  return (
    <>
      <Box
        sx={{
          display: "flex",
          width: "100%",
          flexWrap: "wrap",
        }}
      >
        <Button
          disabled={disableAll}
          variant="contained"
          color="primary"
          onClick={onSubmitBackup}
          sx={{ mr: 1, mb: 1 }}
        >
          Резервная копия БД
        </Button>

        <Box>
          <label htmlFor="upload">
            <input
              ref={restore}
              style={{ display: "none" }}
              id="upload"
              name="upload"
              type="file"
              onInput={onSubmitRestore}
            />
            <Button
              disabled={disableAll}
              variant="contained"
              color="primary"
              component="span"
              sx={{ mr: 1, mb: 1 }}
            >
              Восстановление БД
            </Button>
          </label>
        </Box>
      </Box>
    </>
  );
};

export default SettingsBackup;
