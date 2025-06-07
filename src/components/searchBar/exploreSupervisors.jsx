import React, { useState } from "react";
import DoctorSearch from "./doctorSearch";
import UniversityFilterDropdown from "./universityFilter";
import UniversityDoctorList from "./universityDoctorListt";

const ExploreSupervisors = ({ allDoctors, allUniversities }) => {
  const [selectedUniversity, setSelectedUniversity] = useState(null);

  // Find the full university object by name or ID if selected
  const selectedUniversityObject = allUniversities.find(
    (uni) => uni.name === selectedUniversity
  );

  return (
    <div>
      {/* University Filter (Always Visible) */}
      <UniversityFilterDropdown
        universities={allUniversities}
        selected={selectedUniversity}
        onSelect={setSelectedUniversity}
      />

      {/* Doctor Search */}
      {!selectedUniversity && (
        <DoctorSearch doctors={allDoctors} />
      )}

      {/* University Doctor List */}
      {selectedUniversityObject && (
        <UniversityDoctorList university={selectedUniversityObject} />
      )}
    </div>
  );
};

export default ExploreSupervisors;
