import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";

import AuroraBackground from "../components/AuroraBackground";
import PrimaryButton from "../components/PrimaryButton";
import TextInputField from "../components/TextInputField";
import { useAppContext } from "../context/AppContext";
import { Spacing } from "../theme/spacing";
import { Radius } from "../theme/radius";
import { Shadow } from "../theme/shadow";
import { CreateJobPayload, updateJob } from "../jsr/jobs";

const CATEGORIES = [
  { value: "software_engineer", label: "Software Engineer" },
  { value: "data_scientist", label: "Data Scientist" },
  { value: "backend_engineer", label: "Backend Engineer" },
  { value: "frontend_engineer", label: "Frontend Engineer" },
];

const GOVERNORATES = [
  { value: "tunis", label: "Tunis" },
  { value: "bizerte", label: "Bizerte" },
  { value: "sfax", label: "Sfax" },
  { value: "sousse", label: "Sousse" },
  // add the rest later
];

const AddJobScreen = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const editingId = params.id ? Number(params.id) : null;

  const { role, accessToken, createJob } = useAppContext() as any;

  const [title, setTitle] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(CATEGORIES[0].value);
  const [selectedGov, setSelectedGov] = useState(GOVERNORATES[0].value);
  const [location, setLocation] = useState("");
  const [minSalary, setMinSalary] = useState("");
  const [maxSalary, setMaxSalary] = useState("");
  const [minExp, setMinExp] = useState("");
  const [maxExp, setMaxExp] = useState("");
  const [skills, setSkills] = useState("");
  const [shortDesc, setShortDesc] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState("");

  if (role !== "recruiter") return null;

  const handleSubmit = async () => {
    if (!accessToken) {
      setError("You are not logged in. Please log in again.");
      return;
    }

    if (!title.trim() || !companyName.trim() || !shortDesc.trim()) {
      setError("Title, company name and short description are required.");
      return;
    }

    if (minSalary && maxSalary && Number(minSalary) > Number(maxSalary)) {
      setError("Min salary cannot be greater than max salary.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const salary_range =
        minSalary && maxSalary
          ? `${Number(minSalary)}-${Number(maxSalary)}`
          : "";

      const payload: CreateJobPayload = {
        title: title.trim(),
        company_name: companyName.trim(),
        category: selectedCategory,
        governorate: selectedGov,
        location: location.trim(),
        salary_range,
        min_experience_years: minExp ? Number(minExp) : null,
        max_experience_years: maxExp ? Number(maxExp) : null,
        skills: skills.trim(),
        short_description: shortDesc.trim(),
        description: description.trim(),
        tags: "",
        image_url: imageUrl.trim() || undefined,
      };

      if (editingId) {
        // edit existing job
        await updateJob(accessToken, editingId, payload);
      } else {
        // create new job
        await createJob(payload);
      }

      router.push("/my-jobs");
    } catch (e: any) {
      let msg = "Failed to create job.";

      const data = e?.data ?? e;

      if (data?.detail === "Given token not valid for any token type") {
        msg = "Your session has expired. Please log out and log in again.";
      } else if (data && typeof data === "object" && !Array.isArray(data)) {
        const parts: string[] = [];
        for (const [field, errors] of Object.entries(data)) {
          const errorsArray = Array.isArray(errors) ? errors : [errors];
          const text = errorsArray.join(" ");
          const label = field === "non_field_errors" ? "" : `${field}: `;
          parts.push(`${label}${text}`);
        }
        if (parts.length > 0) {
          msg = parts.join("\n");
        }
      } else if (typeof data === "string") {
        msg = data;
      } else if (e?.message) {
        msg = e.message;
      }

      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const renderChips = (
    items: { value: string; label: string }[],
    selected: string,
    onSelect: (v: string) => void
  ) => (
    <View style={styles.chipRow}>
      {items.map((item) => {
        const active = item.value === selected;
        return (
          <TouchableOpacity
            key={item.value}
            onPress={() => onSelect(item.value)}
            style={[styles.chip, active && styles.chipActive]}
            activeOpacity={0.8}
          >
            <Text style={[styles.chipText, active && styles.chipTextActive]}>
              {item.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );

  return (
    <AuroraBackground>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>
          {editingId ? "Edit job offer" : "Create job offer"}
        </Text>

        <View style={styles.card}>
          {error && <Text style={styles.error}>{error}</Text>}

          <TextInputField
            label="Job title"
            value={title}
            onChangeText={setTitle}
            placeholder="e.g. Software Engineer"
          />

          <TextInputField
            label="Company name"
            value={companyName}
            onChangeText={setCompanyName}
            placeholder="e.g. Acme Corp"
          />

          <TextInputField
            label="Image URL"
            value={imageUrl}
            onChangeText={setImageUrl}
            placeholder="https://example.com/banner.jpg"
          />

          <Text style={styles.label}>Category</Text>
          {renderChips(CATEGORIES, selectedCategory, setSelectedCategory)}

          <Text style={styles.label}>Governorate</Text>
          {renderChips(GOVERNORATES, selectedGov, setSelectedGov)}

          <Text style={styles.label}>Salary (TND)</Text>
          <TextInputField
            label="Min salary (TND)"
            value={minSalary}
            onChangeText={setMinSalary}
            keyboardType="numeric"
            placeholder="e.g. 2000"
          />
          <TextInputField
            label="Max salary (TND)"
            value={maxSalary}
            onChangeText={setMaxSalary}
            keyboardType="numeric"
            placeholder="e.g. 3000"
          />

          <TextInputField
            label="Location"
            value={location}
            onChangeText={setLocation}
            placeholder="City / area"
          />

          <TextInputField
            label="Min experience (years)"
            value={minExp}
            onChangeText={setMinExp}
            keyboardType="numeric"
            placeholder="e.g. 1"
          />

          <TextInputField
            label="Max experience (years)"
            value={maxExp}
            onChangeText={setMaxExp}
            keyboardType="numeric"
            placeholder="e.g. 3"
          />

          <TextInputField
            label="Skills"
            value={skills}
            onChangeText={setSkills}
            placeholder="e.g. React, Django"
          />

          <TextInputField
            label="Short description"
            value={shortDesc}
            onChangeText={setShortDesc}
            placeholder="One or two lines about the role"
          />

          <TextInputField
            label="Full description"
            value={description}
            onChangeText={setDescription}
            placeholder="Detailed responsibilities, requirements..."
            multiline
            style={styles.textArea}
          />

          <PrimaryButton
            title={
              loading
                ? editingId
                  ? "Saving..."
                  : "Creating..."
                : editingId
                ? "Save changes"
                : "Create job"
            }
            onPress={handleSubmit}
            disabled={loading}
            variant="solid"
          />
        </View>
      </ScrollView>
    </AuroraBackground>
  );
};

export default AddJobScreen;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.xl,
    paddingBottom: Spacing.xl,
  },
  title: {
    fontSize: 22,
    fontWeight: "900",
    color: "#fff",
    marginBottom: Spacing.lg,
    textAlign: "center",
  },
  card: {
    backgroundColor: "rgba(28,31,46,0.9)",
    borderRadius: Radius.xl,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
    gap: Spacing.md,
    ...Shadow,
  },
  error: {
    color: "#f87171",
    fontSize: 13,
    fontWeight: "700",
  },
  label: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "700",
    marginTop: Spacing.sm,
    marginBottom: 4,
  },
  chipRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: Spacing.sm,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: Radius.pill,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.28)",
    backgroundColor: "transparent",
  },
  chipActive: {
    backgroundColor: "rgba(255,255,255,0.18)",
    borderColor: "#fff",
  },
  chipText: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 12,
    fontWeight: "700",
  },
  chipTextActive: {
    color: "#fff",
  },
  textArea: {
    height: 140,
  },
});























































































































// import React, { useState } from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   SafeAreaView,
//   ScrollView,
//   KeyboardAvoidingView,
//   Platform,
//   TouchableOpacity,
// } from 'react-native';
// import { ArrowLeft } from 'lucide-react-native';
// import { PrimaryButton } from '../components/PrimaryButton';
// import { TextInputField } from '../components/TextInputField';
// import { useAppContext } from '../context/AppContext';
// import { Job } from '../data/jobs';

// export const AddJobScreen = ({ navigation }: any) => {
//   const { addJob } = useAppContext();
//   const [title, setTitle] = useState('');
//   const [company, setCompany] = useState('');
//   const [location, setLocation] = useState('');
//   const [salary, setSalary] = useState('');
//   const [description, setDescription] = useState('');
//   const [errors, setErrors] = useState<Record<string, string>>({});

//   const validateForm = (): boolean => {
//     const newErrors: Record<string, string> = {};

//     if (!title.trim()) {
//       newErrors.title = 'Job title is required';
//     }
//     if (!company.trim()) {
//       newErrors.company = 'Company name is required';
//     }
//     if (!location.trim()) {
//       newErrors.location = 'Location is required';
//     }
//     if (!salary.trim()) {
//       newErrors.salary = 'Salary range is required';
//     }
//     if (!description.trim()) {
//       newErrors.description = 'Job description is required';
//     }

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleSaveJob = () => {
//     if (!validateForm()) {
//       return;
//     }

//     const newJob: Job = {
//       id: Date.now().toString(),
//       title,
//       company,
//       location,
//       salary,
//       description,
//       companyLogo:
//         'https://images.pexels.com/photos/1181406/pexels-photo-1181406.jpeg?auto=compress&cs=tinysrgb&w=200',
//       interestedCount: 0,
//     };

//     addJob(newJob);
//     navigation.goBack();
//   };

//   return (
//     <SafeAreaView style={styles.container}>
//       <View style={styles.header}>
//         <TouchableOpacity
//           onPress={() => navigation.goBack()}
//           style={styles.backButton}
//         >
//           <ArrowLeft size={24} color="#007AFF" strokeWidth={2} />
//         </TouchableOpacity>
//         <Text style={styles.headerTitle}>Add New Job</Text>
//         <View style={styles.placeholder} />
//       </View>

//       <KeyboardAvoidingView
//         behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
//         style={styles.keyboardView}
//       >
//         <ScrollView
//           contentContainerStyle={styles.scrollContent}
//           showsVerticalScrollIndicator={false}
//         >
//           <TextInputField
//             label="Job Title"
//             value={title}
//             onChangeText={(text) => {
//               setTitle(text);
//               if (errors.title) {
//                 setErrors((prev) => ({ ...prev, title: '' }));
//               }
//             }}
//             placeholder="e.g. Senior React Developer"
//             error={errors.title}
//           />

//           <TextInputField
//             label="Company Name"
//             value={company}
//             onChangeText={(text) => {
//               setCompany(text);
//               if (errors.company) {
//                 setErrors((prev) => ({ ...prev, company: '' }));
//               }
//             }}
//             placeholder="e.g. TechCorp Inc."
//             error={errors.company}
//           />

//           <TextInputField
//             label="Location"
//             value={location}
//             onChangeText={(text) => {
//               setLocation(text);
//               if (errors.location) {
//                 setErrors((prev) => ({ ...prev, location: '' }));
//               }
//             }}
//             placeholder="e.g. San Francisco, CA or Remote"
//             error={errors.location}
//           />

//           <TextInputField
//             label="Salary Range"
//             value={salary}
//             onChangeText={(text) => {
//               setSalary(text);
//               if (errors.salary) {
//                 setErrors((prev) => ({ ...prev, salary: '' }));
//               }
//             }}
//             placeholder="e.g. $100k - $150k"
//             error={errors.salary}
//           />

//           <TextInputField
//             label="Job Description"
//             value={description}
//             onChangeText={(text) => {
//               setDescription(text);
//               if (errors.description) {
//                 setErrors((prev) => ({ ...prev, description: '' }));
//               }
//             }}
//             placeholder="Describe the role, responsibilities, and requirements"
//             multiline
//             numberOfLines={6}
//             style={styles.textArea}
//             error={errors.description}
//           />

//           <PrimaryButton
//             title="Save Job"
//             onPress={handleSaveJob}
//             style={styles.saveButton}
//           />
//         </ScrollView>
//       </KeyboardAvoidingView>
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#F8F9FA',
//   },
//   header: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     paddingHorizontal: 16,
//     paddingVertical: 12,
//     backgroundColor: '#FFFFFF',
//     borderBottomWidth: 1,
//     borderBottomColor: '#E5E5E5',
//   },
//   backButton: {
//     padding: 8,
//   },
//   headerTitle: {
//     fontSize: 18,
//     fontWeight: '700',
//     color: '#1A1A1A',
//   },
//   placeholder: {
//     width: 40,
//   },
//   keyboardView: {
//     flex: 1,
//   },
//   scrollContent: {
//     padding: 24,
//   },
//   textArea: {
//     height: 120,
//     textAlignVertical: 'top',
//   },
//   saveButton: {
//     marginTop: 24,
//   },
// });
